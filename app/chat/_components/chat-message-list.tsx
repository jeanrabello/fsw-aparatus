"use client";

import { UIMessage } from "ai";
import { useEffect, useRef } from "react";
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
    <div className="flex flex-col items-start w-full">
      {messages.length === 0 && (
        <>
          {/* System welcome message */}
          <div className="flex flex-col items-start pt-[24px] px-[20px] w-full">
            <div className="border border-border flex flex-col items-start p-[12px] rounded-[12px] w-full">
              <div className="flex items-center justify-center w-full">
                <p className="font-['Plus_Jakarta_Sans',sans-serif] font-normal leading-[1.4] text-[14px] text-muted-foreground text-center">
                  Seu assistente de agendamentos está online.
                </p>
              </div>
            </div>
          </div>

          {/* AI welcome message */}
          <div className="flex flex-col items-start pt-[24px] pl-[12px] pr-[56px] w-full">
            <div className="flex gap-[8px] items-start w-full">
              <AIAvatar />
              <div className="basis-0 grow min-h-px min-w-px">
                <p className="font-['Plus_Jakarta_Sans',sans-serif] font-normal leading-[1.4] text-[14px] text-foreground whitespace-pre-wrap">
                  Olá! Sou o <span className="font-['Merriweather',serif] italic tracking-[-0.7px]">Aparatus.ai</span>, seu assistente pessoal.
                  {"\n\n"}
                  Estou aqui para te auxiliar a agendar seu corte ou barba, encontrar as barbearias disponíveis perto de você e responder às suas dúvidas.
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
