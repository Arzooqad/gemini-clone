import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400"></div>
      <div
        className="flex items-center gap-1"
        aria-live="polite"
        aria-label="Gemini is typing"
      >
        <span>Gemini is typing</span>
        <span className="inline-flex gap-0.5">
          <span className="w-1 h-1 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-300ms]"></span>
          <span className="w-1 h-1 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-150ms]"></span>
          <span className="w-1 h-1 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></span>
        </span>
      </div>
    </div>
  );
}
