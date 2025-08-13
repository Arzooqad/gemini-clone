import React, { useEffect, useMemo, useState } from "react";
import GeminiLayout from "../components/GeminiLayout";
import ChatList from "../components/chat/ChatList";
import MessageInput from "../components/chat/MessageInput";
import TypingIndicator from "../components/chat/TypingIndicator";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { addMessage } from "../redux/slices/chatSlice";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Chatroom } from "../types";
import toast from "react-hot-toast";

export default function ChatPage() {
  const { id: roomId = "" } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const rooms = useSelector((state: RootState) => state.chat.rooms);
  const messages = useSelector(
    (state: RootState) => state.chat.byRoomId[roomId] ?? []
  );

  const [isTyping, setIsTyping] = useState(false);
  const [aiCooldown, setAiCooldown] = useState(false);

  const room = useMemo(
    () => rooms.find((r: Chatroom) => r.id === roomId),
    [rooms, roomId]
  );

  useEffect(() => {
    if (!room) return;
    if (messages.length === 0) {
      const welcomeId = uuidv4();
      dispatch(
        addMessage({
          roomId,
          message: {
            id: welcomeId,
            roomId,
            sender: "ai",
            text: "Hello! Ask me anything.",
            createdAt: new Date().toISOString(),
          },
        })
      );
    }
  }, [roomId]);

  function handleSend(text: string, imageUrl?: string) {
    const now = new Date().toISOString();
    const messageId = uuidv4();
    dispatch(
      addMessage({
        roomId,
        message: {
          id: messageId,
          roomId,
          sender: "user",
          text,
          imageUrl,
          createdAt: now,
        },
      })
    );

    toast.success("Message sent");

    if (aiCooldown) return;

    setIsTyping(true);
    setAiCooldown(true);

    const delay = 1200 + Math.random() * 1200;
    setTimeout(() => {
      const aiText = text
        ? `You said: ${text}. Here's a thoughtful response.`
        : "Nice image! What would you like to know about it?";
      const aiId = uuidv4();
      dispatch(
        addMessage({
          roomId,
          message: {
            id: aiId,
            roomId,
            sender: "ai",
            text: aiText,
            createdAt: new Date().toISOString(),
          },
        })
      );
      setIsTyping(false);
      setTimeout(() => setAiCooldown(false), 800);
    }, delay);
  }

  if (!room) {
    return (
      <GeminiLayout>
        <div className="h-[calc(100vh-56px)] md:h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
          Chatroom not found.
        </div>
      </GeminiLayout>
    );
  }

  return (
    <GeminiLayout>
      <div className="h-[calc(100vh-56px)] md:h-screen flex flex-col gap-3 px-4 md:px-8 py-4">
        <div className="text-center text-xs text-gray-500">{room.title}</div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatList messages={messages} />
        </div>
        {isTyping && <TypingIndicator />}
        <MessageInput onSend={handleSend} disabled={false} />
      </div>
    </GeminiLayout>
  );
}
