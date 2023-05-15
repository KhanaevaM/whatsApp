export enum MessageStatus {
  UnDelivered,
  Delivered,
  Read,
}

export interface ChatPreviewType {
  image: string;
  wid: string;
  status: MessageStatus;
  message: string;
  date: string;
  hasNewMessage: boolean;
  messages: MessageType[];
}

export interface MessageType {
  messageId: string;
  messageText: string;
  isAuthority: boolean;
  time: string;
}

export type AuthStateType = {
  isAuth: boolean;
  isLogged: boolean;
  idInstance: string;
  apiTokenInstance: string;
  wid: string;
  avatar: string;
};

export type ChatsStateType = {
  chats: ChatPreviewType[];
  selectedChat: string;
};

export type MessagesStateType = {
  messages: MessageType[];
};
