import { Box, Typography } from "@mui/material";

type Props = { text: string; time: string; isAuth: boolean };

const Message = ({ text, time, isAuth }: Props) => {
  const bg = isAuth ? "#D9FDD3" : "white";
  const align = isAuth ? "flex-end" : "flex-start";

  return (
    <Box
      bgcolor={bg}
      padding="0.5rem"
      borderRadius="10px"
      maxWidth="640px"
      marginY="10px"
      position="relative"
      sx={{ boxShadow: "0 1px #CED0D1", alignSelf: `${align}` }}
      display="inline-flex"
    >
      <Typography paddingRight="40px" paddingLeft="4px">
        {text}
      </Typography>
      <Typography
        fontSize="0.75rem"
        color="gray"
        position="absolute"
        bottom="2px"
        right="8px"
      >
        {time}
      </Typography>
    </Box>
  );
};

export default Message;
