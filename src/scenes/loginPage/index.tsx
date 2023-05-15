import { Box, Button, InputBase, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setAuth } from "../../state/auth";
import { RootState } from "../../store";

type Props = {};

var myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");

const LoginPage = (props: Props) => {
  const isAuthorized = useSelector((state: RootState) => state.user.isAuth);
  const [initialLogin, setInitialLogin] = useState(true);
  const [imageData, setImageData] = useState("");
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const dispatch = useDispatch();

  const checkValid = () => {
    if (idInstance.length > 0 && apiTokenInstance.length > 0) return true;
    return false;
  };

  const checkAuth = async () => {
    setInitialLogin(false);

    const response: any = await fetch(
      `https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
      {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      }
    ).catch((error) => console.log("error", error));

    if (response.ok) {
      const result = await response.json();

      if (result["stateInstance"] === "notAuthorized") {
        dispatch(setAuth({ isAuth: false }));
      } else if (result["stateInstance"] === "authorized") {
        dispatch(setAuth({ isAuth: true }));
        login();
      }
    }
  };

  const login = async () => {
    const response: any = await fetch(
      `https://api.green-api.com/waInstance${idInstance}/GetSettings/${apiTokenInstance}`,
      {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      }
    ).catch((error) => console.log("error", error));

    if (response.ok) {
      const result = await response.json();
      var raw = `{"chatId": "${result["wid"]}"}`;

      const avatarResponse: any = await fetch(
        `https://api.green-api.com/waInstance${idInstance}/GetAvatar/${apiTokenInstance}`,
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        }
      ).catch((avatarError) => console.log("error", avatarError));

      if (avatarResponse.ok) {
        const avatarResult = await avatarResponse.json();
        const avatar = avatarResult["urlAvatar"];

        dispatch(
          setLogin({
            idInstance: idInstance,
            apiTokenInstance: apiTokenInstance,
            wid: result["wid"],
            isLogged: true,
            avatar: avatar,
          })
        );
      }
    }
  };

  const requestQr = async () => {
    const response: any = await fetch(
      `https://api.green-api.com/waInstance${idInstance}/qr/${apiTokenInstance}`,
      {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      }
    ).catch((error) => console.log("error", error));
    if (response.ok) {
      const result = await response.json();
      if (result["type"] === "alreadyLogged") {
        dispatch(setLogin({ isAuth: true }));
      } else if (result["type"] === "qrCode") {
        setImageData(result["message"]);
      }
    }
  };

  return (
    <Box
      bgcolor="#E1E1DE"
      width="100%"
      height="100vh"
      display="flex"
      alignItems="center"
    >
      <Box
        width="30%"
        marginX="auto"
        paddingY="2rem"
        bgcolor="white"
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        gap="1rem"
      >
        {!initialLogin && !isAuthorized && (
          <Box>
            <Typography color="red" textAlign="center" marginBottom="1rem">
              Not authorized
            </Typography>
            <Box
              bgcolor="#F0F0F0"
              height="276px"
              width="276px"
              position="relative"
              borderRadius="1rem"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {imageData ? (
                <img
                  src={`data:image/jpeg;base64,${imageData}`}
                  alt="qr code"
                  style={{
                    position: "absolute",
                    top: "50",
                    left: "50",
                  }}
                />
              ) : (
                <Button
                  variant="contained"
                  disabled={!checkValid()}
                  sx={{
                    backgroundColor: "#00A884",
                    "&:hover": {
                      backgroundColor: "#24CCA8",
                      boxShadow: "none",
                    },
                  }}
                  onClick={() => requestQr()}
                >
                  Request QR code
                </Button>
              )}
            </Box>
            {imageData && (
              <Box display="flex" justifyContent="center" marginY="1rem">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#00A884",
                    "&:hover": {
                      backgroundColor: "#24CCA8",
                      boxShadow: "none",
                    },
                  }}
                  onClick={() => requestQr()}
                >
                  Request another QR code
                </Button>
              </Box>
            )}
          </Box>
        )}
        <InputBase
          required={true}
          sx={{
            marginX: "10px",
            width: "80%",
            bgcolor: "#F0F2F5",
            borderRadius: "0.5rem",
            padding: "1rem",
            align: "center",
            textAlign: "center",
            "& input": {
              textAlign: "center",
            },
          }}
          placeholder="idInstance"
          value={idInstance}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setIdInstance(event.target.value);
          }}
        />

        <InputBase
          required={true}
          sx={{
            marginX: "10px",
            width: "80%",
            bgcolor: "#F0F2F5",
            padding: "1rem",
            align: "center",
            textAlign: "center",
            "& input": {
              textAlign: "center",
            },
          }}
          placeholder="apiTokenInstance"
          value={apiTokenInstance}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setApiTokenInstance(event.target.value);
          }}
        />
        <Button
          variant="contained"
          disabled={!checkValid()}
          sx={{
            backgroundColor: "#00A884",
            marginTop: "1rem",
            "&:hover": {
              backgroundColor: "#24CCA8",
              boxShadow: "none",
            },
          }}
          onClick={() => checkAuth()}
        >
          LOGIN
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
