"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { ChatHeader } from "./_components/chat-header";
import { ChatMessageList } from "./_components/chat-message-list";
import { ChatInput } from "./_components/chat-input";

export default function ChatPage() {
  const [inputValue, setInputValue] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSubmit = async () => {
    if (!inputValue.trim() || status === "streaming") return;

    const messageToSend = inputValue;
    setInputValue("");
    await sendMessage({ text: messageToSend });
  };

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto pb-[104px]">
        <ChatMessageList messages={messages} />
      </div>
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        disabled={status === "streaming"}
      />
    </div>
  );
}
