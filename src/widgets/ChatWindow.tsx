import { Box } from "@mui/material";
import ChatWindowTop from "./ChatWindowTop";
import ChatWindowContent from "./ChatWindowContent";
import InputMessage from "./InputMessage";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setNotification } from "../state/chats";

type Props = { chatHeight: number };

const ChatWindow = ({ chatHeight }: Props) => {
  const [height, setHeight] = useState(0);
  const [heightUpdated, setHeightUpdated] = useState(false);
  const [image, setImage] = useState("");
  const chats = useSelector((state: RootState) => state.chats.chats);
  const selectedChatId = useSelector(
    (state: RootState) => state.chats.selectedChat
  );
  const dispatch = useDispatch();

  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref && ref.current) {
      setHeight(ref.current.clientHeight);
      setHeightUpdated(false);
    }
  }, [heightUpdated]);

  useEffect(() => {
    dispatch(setNotification({ wid: selectedChatId, hasNewMessage: false }));
    setAvatar();
  }, []);

  const updateHeight = () => {
    setHeightUpdated(true);
  };

  const setAvatar = () => {
    chats.forEach(function (item) {
      if (item.wid === selectedChatId) {
        setImage(item.image);
      }
    });
  };

  return (
    <Box width="100%" height="100%">
      {selectedChatId !== "" ? (
        <Box display="flex" justifyItems="space-between" flexDirection="column">
          <ChatWindowTop image={image} name={selectedChatId} />
          <Box flexGrow="1">
            <ChatWindowContent chatHeight={chatHeight - height} />
          </Box>
          <InputMessage ref={ref} updateHeight={updateHeight} />
        </Box>
      ) : (
        <Box
          width="100%"
          height="100%"
          bgcolor="#EFEAE2"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          Enter phone number in search field to start chat
        </Box>
      )}
    </Box>
  );
};

export default ChatWindow;
