import React, { useMemo, useRef, useLayoutEffect } from "react";
import { ChatMessage as ChatMessageType } from "../../types";
import ChatMessage from "./ChatMessage";

interface Props {
  messages: ChatMessageType[];
}

export default function ChatList({ messages }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const rendered = useMemo(
    () =>
      messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      )),
    [messages]
  );

  return (
    <div
      ref={containerRef}
      className="h-full min-h-0 overflow-y-auto flex flex-col gap-3 px-1"
    >
      {rendered}
      <div ref={bottomRef} />
    </div>
  );
}
