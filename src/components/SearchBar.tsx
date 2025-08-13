import React, { useEffect, useState } from "react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import Input from "./Input";

interface Props {
  onChange: (value: string) => void;
}

export default function SearchBar({ onChange }: Props) {
  const [value, setValue] = useState("");
  const debounced = useDebouncedValue(value, 300);

  useEffect(() => {
    onChange(debounced);
  }, [debounced, onChange]);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="hidden sm:block w-64 rounded-full px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 border-0"
      placeholder="Search chats"
      aria-label="Search chatrooms"
    />
  );
}
