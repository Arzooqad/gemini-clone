import React, { useEffect, useRef } from "react";
import GeminiLayout from "../components/GeminiLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { createRoom } from "../redux/slices/chatSlice";
import { Chatroom } from "../types";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const rooms = useSelector((state: RootState) => state.chat.rooms);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    if (rooms.length > 0) {
      initializedRef.current = true;
      navigate(`/chat/${rooms[0].id}`);
      return;
    }
    // Create a first room if none exists
    const room: Chatroom = {
      id: uuidv4(),
      title: "New chat",
      createdAt: new Date().toISOString(),
    };
    dispatch(createRoom(room));
    initializedRef.current = true;
    navigate(`/chat/${room.id}`);
  }, [rooms]);

  return (
    <GeminiLayout>
      <div className="h-[calc(100vh-56px)] md:h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Hello,
            </h1>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Enter a prompt to get started.
            </p>
          </div>
        </div>
        <div className="px-4 md:px-8 pb-6">
          <div className="mx-auto max-w-3xl rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 text-gray-600 dark:text-gray-300">
            Enter a prompt for Gemini
          </div>
          <div className="mt-2 flex gap-2 justify-center text-xs text-gray-500">
            <span className="rounded-full border px-2 py-1">Deep Research</span>
            <span className="rounded-full border px-2 py-1">Canvas</span>
            <span className="rounded-full border px-2 py-1">Image</span>
            <span className="rounded-full border px-2 py-1">
              Guided Learning
            </span>
          </div>
        </div>
      </div>
    </GeminiLayout>
  );
}
