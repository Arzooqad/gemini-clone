export type SenderType = "user" | "ai";

export interface ChatMessage {
  id: string;
  roomId: string;
  sender: SenderType;
  text?: string;
  imageUrl?: string;
  createdAt: string; // ISO string
}

export interface Chatroom {
  id: string;
  title: string;
  createdAt: string; // ISO string
}

export interface AuthUser {
  countryCode: string; // e.g., +1
  phone: string; // digits only
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

export interface MessagesState {
  byRoomId: Record<string, ChatMessage[]>;
}

export interface ChatroomsState {
  rooms: Chatroom[];
}
