import React, { useState } from "react";
import { ChatMessage as ChatMessageType } from "../../types";
import { copyTextToClipboard } from "../../utils/clipboard";
import { IoCopyOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import Button from "../Button";

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.sender === "user";
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group relative flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`relative max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow ${
          isUser
            ? "bg-sky-600 text-white rounded-br-sm"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm"
        }`}
      >
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="uploaded"
            className="mb-2 max-h-64 rounded-lg object-contain"
          />
        )}
        {message.text && (
          <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        )}
        <div
          className={`mt-1 text-[11px] ${
            isUser ? "text-sky-100" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {message.text && hovered && (
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-1 ${
              isUser ? "left-1" : "right-1"
            } opacity-90 dark:bg-black/40 p-1 text-xs`}
            onClick={async () => {
              const ok = await copyTextToClipboard(message.text || "");
              if (ok) {
                toast.success("Copied");
              }
            }}
            aria-label="Copy message"
          >
            <IoCopyOutline className="text-gray-500 dark:text-gray-100" />
          </Button>
        )}
      </div>
    </div>
  );
}
