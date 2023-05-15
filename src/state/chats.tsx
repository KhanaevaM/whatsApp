import { createSlice } from "@reduxjs/toolkit";
import { ChatsStateType, MessageType } from "../shared/types";

const initialState: ChatsStateType = {
  chats: [],
  selectedChat: "",
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    addChat: (state, action) => {
      const found = state.chats.find(
        (element) => element.wid === action.payload.wid
      );

      if (!found) {
        state.chats.push(action.payload.chat);
      }
      state.selectedChat = action.payload.chat.wid;
    },
    removeChat: (state, action) => {
      if (state.selectedChat === action.payload.wid) {
        state.selectedChat = "";
      }

      state.chats.forEach(function (item, index, object) {
        if (item.wid === action.payload.wid) {
          object.splice(index, 1);
        }
      });
    },
    selectChat: (state, action) => {
      state.chats.forEach(function (item, index, object) {
        if (item.wid === action.payload.wid) {
          state.selectedChat = action.payload.wid;
        }
      });
    },
    setLastMessage: (state, action) => {
      state.chats.forEach(function (item) {
        if (item.wid === action.payload.wid) {
          item.message = action.payload.message;
          item.date = action.payload.date;
        }
      });
    },
    setNotification: (state, action) => {
      state.chats.forEach(function (item) {
        if (item.wid === action.payload.wid) {
          item.hasNewMessage = action.payload.hasNewMessage;
        }
      });
    },
    clearChats: (state) => {
      state.chats = [];
      state.selectedChat = "";
    },
    setMessages: (state, action) => {
      const foundChat = state.chats.find(
        (element) => element.wid === action.payload.wid
      );

      if (foundChat) {
        foundChat.messages = action.payload.messages;
      }
    },
    addMessage: (state, action) => {
      const foundChat = state.chats.find(
        (element) => element.wid === action.payload.wid
      );

      if (foundChat) {
        const foundMessage = foundChat.messages.find(
          (element: MessageType) => element.messageId === action.payload.id
        );

        if (!foundMessage) {
          const newMessage: MessageType = {
            messageId: action.payload.id,
            messageText: action.payload.text,
            isAuthority: action.payload.isAuthority,
            time: action.payload.time,
          };

          foundChat.messages.push(newMessage);
        }
      }
    },
    clearMessages: (state, action) => {
      const foundChat = state.chats.find(
        (element) => element.wid === action.payload.wid
      );
      if (foundChat) {
        foundChat.messages = [];
      }
    },
  },
});

export const {
  addChat,
  removeChat,
  selectChat,
  setLastMessage,
  clearChats,
  setNotification,
  setMessages,
  addMessage,
  clearMessages,
} = chatsSlice.actions;
export default chatsSlice.reducer;
