import { Box, IconButton, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { removeChat, selectChat } from "../state/chats";
import EmailIcon from "@mui/icons-material/Email";

type Props = {
  image: string;
  wid: string;
  selected: boolean;
  message: string;
  date: string;
  notification: boolean;
};

const ChatPreview = ({
  image,
  wid,
  selected,
  message,
  date,
  notification,
}: Props) => {
  const dispatch = useDispatch();
  const bgColor = selected ? "#F0F2F5" : "white";
  const remove = (phoneUpdate: string) => {
    dispatch(removeChat({ wid: phoneUpdate }));
  };

  const select = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dispatch(selectChat({ wid: wid }));
  };

  return (
    <Box
      display="flex"
      bgcolor={bgColor}
      alignItems="center"
      height="96px"
      sx={{
        "&:hover": {
          backgroundColor: "#F0F2F5",
        },
      }}
      onClick={select}
    >
      <Avatar
        alt="Remy Sharp"
        src={image}
        sx={{ margin: "10px", width: 48, height: 48 }}
      />
      <Box
        display="flex"
        flexDirection="column"
        flexGrow="1"
        marginX="1rem"
        height="96px"
        sx={{ borderBottom: "0.1em solid #CED0D1" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          paddingTop="1rem"
        >
          <Typography>{wid.substring(0, wid.indexOf("@"))}</Typography>

          <IconButton onClick={() => remove(wid)}>
            <DeleteIcon />
          </IconButton>
        </Box>
        {notification ? (
          <EmailIcon />
        ) : (
          <Box display="flex" paddingBottom="1rem" alignItems="center">
            <Typography fontSize="0.7rem">{date}</Typography>
            <Box
              marginLeft="10px"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "330px",
              }}
            >
              <Typography noWrap>{message}</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatPreview;
