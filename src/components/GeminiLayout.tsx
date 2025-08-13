import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import { AppDispatch, RootState } from "../redux/store";
import { createRoom, deleteRoom } from "../redux/slices/chatSlice";
import { logout } from "../redux/slices/authSlice";
import { Chatroom } from "../types";
import { v4 as uuidv4 } from "uuid";
import geminiIcon from "../assets/google-gemini-icon.svg";
import Button from "./Button";
import Input from "./Input";
import toast from "react-hot-toast";
import { FaRegTrashCan } from "react-icons/fa6";

interface GeminiLayoutProps {
  children: React.ReactNode;
}

export default function GeminiLayout({ children }: GeminiLayoutProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const rooms = useSelector((state: RootState) => state.chat.rooms);

  const [query, setQuery] = useState("");

  const filteredRooms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rooms;
    return rooms.filter((r: Chatroom) => r.title.toLowerCase().includes(q));
  }, [rooms, query]);

  function handleCreateRoom() {
    const room: Chatroom = {
      id: uuidv4(),
      title: "New chat",
      createdAt: new Date().toISOString(),
    };
    dispatch(createRoom(room));
    navigate(`/chat/${room.id}`);
  }

  function handleLogout() {
    dispatch(logout());
    navigate("/auth", { replace: true });
  }

  function handleDeleteRoom(id: string) {
    if (!window.confirm("Delete this chat?")) return;
    dispatch(deleteRoom(id));
    toast.success("Chat deleted");
    if (location.pathname === `/chat/${id}`) {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-black transition-colors">
      <aside className="hidden md:flex md:w-72 lg:w-80 shrink-0 flex-col border-r border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/50 backdrop-blur">
        <header className="h-14 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <img src={geminiIcon} alt="Gemini" className="w-6 h-6" />
            <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
              Gemini
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="rounded-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
              title="Logout"
            >
              Logout
            </Button>
          </div>
        </header>
        <div className="p-3">
          <Button onClick={handleCreateRoom} fullWidth>
            New chat
          </Button>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats"
            className="mt-3 rounded-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 border-0"
          />
        </div>
        <div className="px-2 pb-4 overflow-y-auto">
          <div className="px-2 py-2 text-xs uppercase tracking-wide text-gray-500">
            Recent
          </div>
          <ul className="space-y-1">
            {filteredRooms.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">No chatrooms</li>
            )}
            {filteredRooms.map((room) => {
              const isActive = location.pathname === `/chat/${room.id}`;
              return (
                <li key={room.id}>
                  <div
                    className={
                      `group flex items-center rounded-md ` +
                      (isActive
                        ? "bg-sky-100 dark:bg-sky-900/30"
                        : "hover:bg-gray-100 dark:hover:bg-gray-900")
                    }
                  >
                    <Link
                      to={`/chat/${room.id}`}
                      className={
                        `flex-1 px-3 py-2 text-sm ` +
                        (isActive
                          ? "text-sky-700 dark:text-sky-300"
                          : "text-gray-800 dark:text-gray-200")
                      }
                      title={room.title}
                    >
                      <div className="truncate">{room.title}</div>
                    </Link>
                    <button
                      type="button"
                      aria-label="Delete chat"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteRoom(room.id);
                      }}
                      className="mr-2 rounded p-1 text-gray-400 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Delete chat"
                    >
                      <FaRegTrashCan />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 bg-white/70 dark:bg-gray-950/50 backdrop-blur">
          <Link to="/" className="flex items-center gap-2">
            <img src={geminiIcon} alt="Gemini" className="w-6 h-6" />
            <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
              Gemini
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="rounded-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
              title="Logout"
            >
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
