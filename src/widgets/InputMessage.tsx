import { Box, IconButton, InputBase } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import MoodIcon from "@mui/icons-material/Mood";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { RootState } from "../store";

type Props = { updateHeight: () => void };

const InputMessage = forwardRef<HTMLDivElement, Props>(
  ({ updateHeight }, ref: any) => {
    const idInstance = useSelector((state: RootState) => state.user.idInstance);
    const selectedChat = useSelector(
      (state: RootState) => state.chats.selectedChat
    );
    const apiTokenInstance = useSelector(
      (state: RootState) => state.user.apiTokenInstance
    );
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
      updateHeight();
    }, [inputValue, updateHeight]);

    const handleSend = async (value: string) => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");

      var raw = `{"chatId": "${selectedChat}","message": "${value}"}`;

      var requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        `https://api.green-api.com/waInstance${idInstance}/SendMessage/${apiTokenInstance}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      setInputValue("");
    };

    return (
      <Box
        bgcolor="#F0F2F5"
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        padding="0.5rem 0 0.5rem 0.5rem"
        minHeight="62px"
        border="0"
        ref={ref}
      >
        <IconButton sx={{ marginX: "0.2rem" }}>
          <MoodIcon />
        </IconButton>
        <IconButton sx={{ marginX: "0.2rem" }}>
          <AttachFileIcon />
        </IconButton>
        <Box
          bgcolor="white"
          borderRadius="8px"
          flexGrow="1"
          paddingX="10px"
          display="flex"
          alignItems="center"
          minHeight="46px"
        >
          <InputBase
            sx={{
              marginX: "10px",
              width: "100%",
              maxWidth: "1000",
            }}
            placeholder="Введите новое сообщение"
            multiline={true}
            maxRows="5"
            value={inputValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setInputValue(event.target.value);
            }}
          />
        </Box>

        {inputValue ? (
          <IconButton
            sx={{ marginX: "0.4rem" }}
            onClick={() => handleSend(inputValue)}
          >
            <SendIcon />
          </IconButton>
        ) : (
          <IconButton sx={{ marginX: "0.4rem" }}>
            <KeyboardVoiceIcon />
          </IconButton>
        )}
      </Box>
    );
  }
);

export default InputMessage;
