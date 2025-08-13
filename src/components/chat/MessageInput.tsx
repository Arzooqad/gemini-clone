import React, { useRef, useState } from "react";
import { FaRegImage } from "react-icons/fa6";
import Button from "../Button";

interface Props {
  onSend: (text: string, imageUrl?: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const inputRef = useRef<HTMLInputElement>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }

  function handleSubmit() {
    if (!text.trim() && !imagePreview) return;
    onSend(text.trim(), imagePreview);
    setText("");
    setImagePreview(undefined);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex items-end gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <label
        className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        aria-label="Upload image"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
        <FaRegImage className="text-gray-500 dark:text-gray-100" />
      </label>
      <div className="flex-1">
        {imagePreview && (
          <div className="mb-2">
            <img
              src={imagePreview}
              alt="preview"
              className="max-h-40 rounded-lg object-contain"
            />
          </div>
        )}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={imagePreview ? 2 : 1}
          placeholder="Message Gemini..."
          className="w-full resize-none outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          aria-label="Message input"
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={disabled}
        className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full"
        aria-label="Send message"
      >
        ➤
      </Button>
    </div>
  );
}
