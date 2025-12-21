import { UIMessage } from "ai";
import { AIAvatar } from "./ai-avatar";

interface ChatMessageProps {
  message: UIMessage;
  isFirstMessage?: boolean;
}

export const ChatMessage = ({ message, isFirstMessage }: ChatMessageProps) => {
  const textContent = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  // System message (first message)
  if (isFirstMessage && message.role === "assistant") {
    return (
      <div className="flex flex-col items-start pt-[24px] px-[20px] w-full">
        <div className="border border-border flex flex-col items-start p-[12px] rounded-[12px] w-full">
          <div className="flex items-center justify-center w-full">
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-normal leading-[1.4] text-[14px] text-muted-foreground text-center">
              {textContent}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // AI message
  if (message.role === "assistant") {
    return (
      <div className="flex flex-col items-start pt-[24px] pl-[12px] pr-[56px] w-full">
        <div className="flex gap-[8px] items-start w-full">
          <AIAvatar />
          <div className="basis-0 grow min-h-px min-w-px">
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-normal leading-[1.4] text-[14px] text-foreground whitespace-pre-wrap">
              {textContent}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User message
  return (
    <div className="flex flex-col items-end pt-[24px] pl-[40px] pr-[20px] w-full">
      <div className="bg-secondary flex h-[40px] items-center px-[16px] py-[12px] rounded-full">
        <p className="font-['Plus_Jakarta_Sans',sans-serif] font-normal leading-[1.4] text-[14px] text-foreground">
          {textContent}
        </p>
      </div>
    </div>
  );
};
