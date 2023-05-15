import { Box, List } from "@mui/material";
import { ChatPreviewType } from "../shared/types";
import ChatPreview from "./ChatPreview";
import { useSelector } from "react-redux";
import { RootState } from "../store";

type Props = { chatHeight: number };

const ChatList = ({ chatHeight }: Props) => {
  const chats = useSelector((state: RootState) => state.chats.chats);
  const selectedChat = useSelector(
    (state: RootState) => state.chats.selectedChat
  );

  return (
    <Box bgcolor="white">
      <List
        sx={{
          width: "100%",
          position: "relative",
          overflow: "auto",
          height: `${chatHeight - 10}px`,
          maxHeight: `${chatHeight - 10}px`,
          padding: 0,
        }}
      >
        {chats.map((item: ChatPreviewType, index: number) => (
          <li key={index}>
            <ChatPreview
              key={index}
              image={item.image}
              wid={item.wid}
              selected={selectedChat === item.wid}
              message={item.message}
              date={item.date}
              notification={item.hasNewMessage}
            />
          </li>
        ))}
      </List>
    </Box>
  );
};

export default ChatList;
