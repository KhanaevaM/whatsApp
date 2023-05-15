import { Avatar, Box, Button } from "@mui/material";

import { useDispatch } from "react-redux";
import { setLogout } from "../state/auth";
import { clearChats } from "../state/chats";

type Props = { image: string };

const ProfileInfo = ({ image }: Props) => {
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(clearChats());
    dispatch(setLogout());
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      bgcolor="#F0F2F5"
      alignItems="center"
      height="60px"
      style={{ padding: "0.5em", borderRight: "0.1em solid #CED0D1" }}
    >
      <Avatar alt="avatar" src={image} sx={{ margin: "10px" }} />
      <Box>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#00A884",
            "&:hover": {
              backgroundColor: "#24CCA8",
              boxShadow: "none",
            },
          }}
          onClick={() => logout()}
        >
          LOGOUT
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileInfo;
