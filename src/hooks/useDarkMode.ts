import { useEffect, useState } from "react";

const THEME_KEY = "theme_preference";

export type ThemeMode = "light" | "dark";

export function useDarkMode() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;
      if (stored === "dark" || stored === "light") return stored;
    } catch {}
    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem(THEME_KEY, mode);
    } catch {}
  }, [mode]);

  return { mode, setMode } as const;
}
