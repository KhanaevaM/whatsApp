import { createSlice } from "@reduxjs/toolkit";
import { AuthStateType } from "../shared/types";

const initialState: AuthStateType = {
  isAuth: true,
  isLogged: false,
  idInstance: "",
  apiTokenInstance: "",
  wid: "",
  avatar: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuth = action.payload.isAuth;
    },
    setLogin: (state, action) => {
      state.idInstance = action.payload.idInstance;
      state.apiTokenInstance = action.payload.apiTokenInstance;
      state.wid = action.payload.wid;
      state.isLogged = true;
      state.avatar = action.payload.avatar;
    },
    setLogout: (state) => {
      state.idInstance = "";
      state.apiTokenInstance = "";
      state.wid = "";
      state.isLogged = false;
      state.avatar = "";
    },
  },
});

export const { setAuth, setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
