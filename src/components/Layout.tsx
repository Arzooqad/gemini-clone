import React from "react";
import DarkModeToggle from "./DarkModeToggle";
import { Link } from "react-router-dom";
import geminiIcon from "../assets/google-gemini-icon.svg";

interface LayoutProps {
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  mainClassName?: string;
}

export default function Layout({
  rightSlot,
  children,
  mainClassName,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black transition-colors">
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={geminiIcon} alt="Gemini" className="w-6 h-6" />
            <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
              Gemini
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {rightSlot}
            <DarkModeToggle />
          </div>
        </div>
      </header>
      <main
        className={`mx-auto max-w-5xl px-4 sm:px-6 py-6 ${mainClassName ?? ""}`}
      >
        {children}
      </main>
    </div>
  );
}
