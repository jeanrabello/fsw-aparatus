"use client";

import { UIMessage } from "ai";
import { useEffect, useRef } from "react";
import { Streamdown } from "streamdown";
import { ChatMessage } from "./chat-message";
import { AIAvatar } from "./ai-avatar";

interface ChatMessageListProps {
  messages: UIMessage[];
}

export const ChatMessageList = ({ messages }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex w-full flex-col items-start">
      {messages.length === 0 && (
        <>
          {/* System welcome message */}
          <div className="flex w-full flex-col items-start px-5 pt-6">
            <div className="border-border flex w-full flex-col items-start rounded-[12px] border p-3">
              <div className="flex w-full items-center justify-center">
                <Streamdown className="text-muted-foreground text-center font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[1.4] font-normal">
                  Seu assistente de agendamentos está online.
                </Streamdown>
              </div>
            </div>
          </div>

          {/* AI welcome message */}
          <div className="flex w-full flex-col items-start pt-[24px] pr-[56px] pl-[12px]">
            <div className="flex w-full items-start gap-[8px]">
              <AIAvatar />
              <div className="min-h-px min-w-px grow basis-0">
                <p className="text-foreground font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[1.4] font-normal whitespace-pre-wrap">
                  Olá! Sou o{" "}
                  <span className="font-['Merriweather',serif] tracking-[-0.7px] italic">
                    Aparatus.ai
                  </span>
                  , seu assistente pessoal.
                  {"\n\n"}
                  Estou aqui para te auxiliar a agendar seu corte ou barba,
                  encontrar as barbearias disponíveis perto de você e responder
                  às suas dúvidas.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {messages.map((message, index) => (
        <ChatMessage
          key={message.id}
          message={message}
          isFirstMessage={index === 0}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
