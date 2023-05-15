import { Box } from "@mui/material";
import ChatList from "../../widgets/ChatList";
import ProfileInfo from "../../widgets/ProfileInfo";
import ChatsSearch from "../../widgets/ChatsSearch";
import ChatWindow from "../../widgets/ChatWindow";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type Props = {};

const ChatPage = (props: Props) => {
  const avatar = useSelector((state: RootState) => state.user.avatar);
  const [height, setHeight] = useState<number>(0);
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref && ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, []);

  return (
    <Box
      bgcolor="#E1E1DE"
      width="100%"
      height="100vh"
      display="flex"
      alignItems="center"
    >
      <Box
        width="90%"
        height="90vh"
        marginX="auto"
        marginY="0"
        display="flex"
        ref={ref}
      >
        <Box width="474px" minWidth="336px" overflow="hidden">
          <ProfileInfo image={avatar} />
          <ChatsSearch />
          <ChatList chatHeight={height - 60 - 56} />
        </Box>
        <Box flexGrow="1">
          <ChatWindow chatHeight={height - 60} />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
