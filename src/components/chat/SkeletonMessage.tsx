import React from "react";

export default function SkeletonMessage({
  align = "left" as "left" | "right",
}) {
  const isRight = align === "right";
  return (
    <div
      className={`flex ${
        isRight ? "justify-end" : "justify-start"
      } animate-pulse`}
    >
      <div
        className={`h-16 w-56 rounded-2xl ${
          isRight
            ? "bg-sky-200/50 dark:bg-sky-900/30"
            : "bg-gray-200 dark:bg-gray-800"
        }`}
      ></div>
    </div>
  );
}
