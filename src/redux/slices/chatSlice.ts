import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ChatMessage,
  Chatroom,
  MessagesState,
  ChatroomsState,
} from "../../types";

interface ChatState extends MessagesState, ChatroomsState {}

const initialState: ChatState = {
  rooms: [],
  byRoomId: {},
};

interface AddMessagePayload {
  roomId: string;
  message: ChatMessage;
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createRoom(state, action: PayloadAction<Chatroom>) {
      state.rooms.unshift(action.payload);
      if (!state.byRoomId[action.payload.id]) {
        state.byRoomId[action.payload.id] = [];
      }
    },
    deleteRoom(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.rooms = state.rooms.filter((room) => room.id !== id);
      delete state.byRoomId[id];
    },
    addMessage(state, action: PayloadAction<AddMessagePayload>) {
      const { roomId, message } = action.payload;
      const existingMessages = state.byRoomId[roomId] ?? [];

      // Determine if this is the first user-authored message in this room
      const isFirstUserMessage =
        message.sender === "user" &&
        !existingMessages.some((m) => m.sender === "user");

      // Append message
      const nextList = [...existingMessages, message];
      state.byRoomId[roomId] = nextList;

      // If it's the first user message, update the room title to the message text (fallback to Image if only image)
      if (isFirstUserMessage) {
        const room = state.rooms.find((r) => r.id === roomId);
        if (room) {
          const proposedTitle = (
            message.text?.trim() || (message.imageUrl ? "Image" : "")
          ).slice(0, 60);
          if (proposedTitle) {
            room.title = proposedTitle;
          }
        }
      }
    },
  },
});

export const { createRoom, deleteRoom, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
