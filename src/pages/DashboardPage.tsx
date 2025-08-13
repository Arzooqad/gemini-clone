import React, { useEffect, useRef } from "react";
import GeminiLayout from "../components/GeminiLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { createRoom } from "../redux/slices/chatSlice";
import { Chatroom } from "../types";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

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
    }
  }, [rooms]);

  function handleCreateRoom() {
    const room: Chatroom = {
      id: uuidv4(),
      title: "New chat",
      createdAt: new Date().toISOString(),
    };
    dispatch(createRoom(room));
    navigate(`/chat/${room.id}`);
  }

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
            <div className="mt-6">
              <Button size="lg" onClick={handleCreateRoom}>
                Create chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </GeminiLayout>
  );
}
