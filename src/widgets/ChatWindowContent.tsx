import { Box, List } from "@mui/material";
import { MessageType } from "../shared/types";
import Message from "./Message";
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

import {
  setLastMessage,
  setNotification,
  addMessage,
  setMessages,
} from "../state/chats";

type Props = { chatHeight: number };

const CHECK_MS = 6000;
const myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");

const ChatWindowContent = ({ chatHeight }: Props) => {
  const dispatch = useDispatch();
  const wid = useSelector((state: RootState) => state.user.wid);
  const selectedChat = useSelector(
    (state: RootState) => state.chats.selectedChat
  );
  const chats = useSelector((state: RootState) => state.chats.chats);

  const scrollRef = useRef<any>(null);

  const idInstance = useSelector((state: RootState) => state.user.idInstance);
  const apiTokenInstance = useSelector(
    (state: RootState) => state.user.apiTokenInstance
  );

  const [currentMessages, setCurrentMessages] = useState<MessageType[]>([]);

  const formatTwoDigits = (time: number) => {
    if (time < 10) {
      return "0" + time;
    }
    return time;
  };

  const getTimeFromTimestamp = (timestamp: string) => {
    const date = new Date(Number(timestamp) * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${formatTwoDigits(hours)}:${formatTwoDigits(minutes)}`;
  };

  const checkAuthority = (type: string, chatId: string, sendByAPI: string) => {
    if (type === "outgoing") {
      return chatId !== wid || sendByAPI;
    }
    return false;
  };

  const getMessages = async () => {
    const raw = `{"chatId": "${selectedChat}","count": 10}`;

    const response: any = await fetch(
      `https://api.green-api.com/waInstance${idInstance}/GetChatHistory/${apiTokenInstance}`,
      {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }
    ).catch((error) => console.log("error", error));
    if (response.ok) {
      const result = await response.json();

      const lastMessages = result
        .reverse()
        .map((res: any) => {
          if (res["idMessage"] !== undefined) {
            return {
              messageId: res["idMessage"],
              messageText: res["textMessage"],
              isAuthority: checkAuthority(
                res["type"],
                res["chatId"],
                res["sendByApi"]
              ),
              time: getTimeFromTimestamp(res["timestamp"]),
            };
          }
          return null;
        })
        .filter(Boolean);

      if (lastMessages.length > 0) {
        dispatch(
          setLastMessage({
            wid: selectedChat,
            message: lastMessages[lastMessages.length - 1].messageText,
            date: lastMessages[lastMessages.length - 1].time,
          })
        );
      }

      dispatch(setMessages({ wid: selectedChat, messages: lastMessages }));
    }
  };

  const deleteNotification = async (receiptId: string) => {
    await fetch(
      `https://api.green-api.com/waInstance${idInstance}/DeleteNotification/${apiTokenInstance}/${receiptId}`,
      {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      }
    ).catch((error) => console.log("error", error));
  };

  const getNotifications = async () => {
    const response: any = await fetch(
      `https://api.green-api.com/waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`,
      {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      }
    ).catch((error) => console.log("error", error));

    const result = await response.json();

    if (result) {
      const receiptId = result["receiptId"];

      const receiptBody = result["body"];

      if (receiptBody["typeWebhook"] === "stateInstanceChanged") {
        await deleteNotification(receiptId);
      } else if (
        receiptBody["typeWebhook"] === "outgoingMessageReceived" ||
        receiptBody["typeWebhook"] === "outgoingAPIMessageReceived"
      ) {
        const messageData = receiptBody["messageData"];
        const senderData = receiptBody["senderData"];
        if (
          messageData["typeMessage"] === "textMessage" ||
          messageData["typeMessage"] === "extendedTextMessage"
        ) {
          let textMessageData;
          let text;
          if (messageData["typeMessage"] === "textMessage") {
            textMessageData = messageData["textMessageData"];
            text = textMessageData["textMessage"];
          } else {
            textMessageData = messageData["extendedTextMessageData"];
            text = textMessageData["text"];
          }

          if (senderData["chatId"] !== selectedChat) {
            //  show notification about new message

            dispatch(
              setNotification({
                wid: senderData["chatId"],
                hasNewMessage: true,
              })
            );
          }

          dispatch(
            addMessage({
              wid: senderData["chatId"],
              id: receiptBody["idMessage"],
              text: text,
              isAuthority:
                receiptBody["typeWebhook"] === "outgoingAPIMessageReceived",
              time: getTimeFromTimestamp(receiptBody["timestamp"]),
            })
          );

          await deleteNotification(receiptId);
        }
      } else if (
        receiptBody["typeWebhook"] === "incomingMessageReceived" ||
        receiptBody["typeWebhook"] === "incomingAPIMessageReceived"
      ) {
        const senderData = receiptBody["senderData"];

        if (senderData["chatId"] !== selectedChat) {
          //  show notification about new message

          dispatch(
            setNotification({ wid: senderData["chatId"], hasNewMessage: true })
          );
        }
        const messageData = receiptBody["messageData"];

        if (
          messageData["typeMessage"] === "textMessage" ||
          messageData["typeMessage"] === "extendedTextMessage"
        ) {
          let textMessageData;
          let text;
          if (messageData["typeMessage"] === "textMessage") {
            textMessageData = messageData["textMessageData"];
            text = textMessageData["textMessage"];
          } else {
            textMessageData = messageData["extendedTextMessageData"];
            text = textMessageData["text"];
          }

          dispatch(
            addMessage({
              wid: senderData["chatId"],
              id: receiptBody["idMessage"],
              text: text,
              isAuthority: false,
              time: getTimeFromTimestamp(receiptBody["timestamp"]),
            })
          );
        }

        await deleteNotification(receiptId);
      } else if (receiptBody["typeWebhook"] === "outgoingMessageStatus") {
        await deleteNotification(receiptId);
      }
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    const foundChat = chats.find((element) => element.wid === selectedChat);
    if (foundChat && foundChat.messages) {
      setCurrentMessages(foundChat.messages);
    }
  }, [selectedChat, chats]);

  useEffect(() => {
    const interval = setInterval(() => {
      getNotifications();
    }, CHECK_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behaviour: "smooth" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const setLastRef = (index: number) => {
    if (index === currentMessages.length - 1) {
      return scrollRef;
    }
  };

  return (
    <Box bgcolor="#EFEAE2" width="100%" height="100%">
      <Box
        display="flex"
        flexDirection="row"
        alignItems="flex-end"
        height={chatHeight - 10}
      >
        <List
          sx={{
            width: "100%",
            position: "relative",
            overflow: "auto",
            minHeight: 0,
            maxHeight: `${chatHeight - 10}px`,
            padding: 0,
          }}
        >
          {currentMessages &&
            currentMessages.map((item: MessageType, index: number) => (
              <li key={index} ref={setLastRef(index)}>
                <Box display="flex" flexDirection="column" paddingX="2rem">
                  <Message
                    key={index}
                    text={item.messageText}
                    time={item.time}
                    isAuth={item.isAuthority}
                  />
                </Box>
              </li>
            ))}
        </List>
      </Box>
    </Box>
  );
};

export default ChatWindowContent;
