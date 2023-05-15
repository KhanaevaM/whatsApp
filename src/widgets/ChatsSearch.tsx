import { Search } from "@mui/icons-material";
import { Box, Divider, IconButton, InputBase, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { addChat } from "../state/chats";
import { useDispatch, useSelector } from "react-redux";
import { MessageStatus } from "../shared/types";
import { RootState } from "../store";

type Props = {};

const ChatsSearch = (props: Props) => {
  const chats = useSelector((state: RootState) => state.chats.chats);
  const idInstance = useSelector((state: RootState) => state.user.idInstance);
  const apiTokenInstance = useSelector(
    (state: RootState) => state.user.apiTokenInstance
  );
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [valid, setValid] = useState(true);
  const dispatch = useDispatch();

  function formatPhoneNumber(phoneNumberString: string) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");

    return cleaned;
  }

  const startChat = async (phone: string) => {
    const isValid =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone);

    if (isValid) {
      const phoneFormatted = formatPhoneNumber(phone);

      var chatExists = false;
      chats.forEach(function (item) {
        if (item.wid === `${phoneFormatted}@c.us`) {
          chatExists = true;
        }
      });

      if (chatExists) {
        setError("Already exists");
      } else {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        var raw = `{"chatId": "${phoneFormatted}@c.us"}`;

        const response = await fetch(
          `https://api.green-api.com/waInstance${idInstance}/GetAvatar/${apiTokenInstance}`,
          {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          }
        );
        if (response.ok) {
          const result = await response.json();
          const avatar = result["urlAvatar"];
          const newChat = {
            image: avatar,
            wid: `${phoneFormatted}@c.us`,
            status: MessageStatus.Read,
            message: "",
            date: "",
          };
          dispatch(addChat({ chat: newChat }));
          setPhone("");
          setError("");
        }
      }
    } else {
      setValid(false);
      setError("Enter valid number");
    }
  };

  return (
    <Fragment>
      <Box
        bgcolor="white"
        display="flex"
        justifyContent="space-between"
        padding="0.5rem 0 0.5rem 0.5rem"
      >
        <Box
          bgcolor="#F0F2F5"
          borderRadius="8px"
          flexGrow="1"
          paddingX="10px"
          display="flex"
          alignItems="center"
        >
          <IconButton>
            <Search />
          </IconButton>
          <InputBase
            sx={{ marginLeft: "30px", width: "30%", flexGrow: "1" }}
            placeholder="Phone number"
            value={phone}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setValid(true);
              setError("");
              setPhone(event.target.value);
            }}
          />
          {(!valid || error) && (
            <Typography color="red" justifySelf="flex-end">
              {error}
            </Typography>
          )}
        </Box>

        <IconButton onClick={() => startChat(phone)}>
          <SendIcon />
        </IconButton>
        <Divider />
      </Box>

      <Divider />
    </Fragment>
  );
};

export default ChatsSearch;
