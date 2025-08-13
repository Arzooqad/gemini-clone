import React from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import Button from "./Button";

export default function DarkModeToggle() {
  const { mode, setMode } = useDarkMode();
  const isDark = mode === "dark";
  return (
    <Button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setMode(isDark ? "light" : "dark")}
      variant="ghost"
      size="sm"
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600"
    >
      <span className="w-4 h-4">
        {isDark ? (
          <span className="inline-block">🌙</span>
        ) : (
          <span className="inline-block">🌞</span>
        )}
      </span>
      <span className="hidden sm:inline text-gray-700 dark:text-gray-200">
        {isDark ? "Dark" : "Light"}
      </span>
    </Button>
  );
}
