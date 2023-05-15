import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/es/storage";
import authReducer from "../state/auth";
import chatsReducer from "../state/chats";

const persistConfigAuth = { key: "auth", storage, version: 1 };
const persistConfigChats = { key: "chats", storage, version: 1 };
const persistedAuthReducer = persistReducer(persistConfigAuth, authReducer);
const persistedChatsReducer = persistReducer(persistConfigChats, chatsReducer);

export type AuthState = ReturnType<typeof authReducer>;
export type ChatsState = ReturnType<typeof chatsReducer>;

const rootReducer = combineReducers({
  user: persistedAuthReducer,
  chats: persistedChatsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
