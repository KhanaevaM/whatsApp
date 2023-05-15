import { Avatar, Box, IconButton, Typography } from "@mui/material";
import Search from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type Props = { image: string; name: string };

const ChatWindowTop = ({ image, name }: Props) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bgcolor="#F0F2F5"
      width="100%"
      paddingX="10px"
      height="60px"
    >
      <Avatar
        alt="avatar"
        src={image}
        sx={{ margin: "10px", width: 40, height: 40 }}
      />
      <Typography flexGrow="1">
        {name && name.substring(0, name.indexOf("@"))}
      </Typography>
      <IconButton>
        <Search />
      </IconButton>
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    </Box>
  );
};

export default ChatWindowTop;
