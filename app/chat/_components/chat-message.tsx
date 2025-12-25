import { UIMessage } from "ai";
import { Streamdown } from "streamdown";
import { AIAvatar } from "./ai-avatar";

interface ChatMessageProps {
  message: UIMessage;
  isFirstMessage?: boolean;
}

export const ChatMessage = ({
  message,
  isFirstMessage,
}: ChatMessageProps) => {
  const textContent = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  // System message (first message)
  if (isFirstMessage && message.role === "assistant") {
    return (
      <div className="flex w-full flex-col items-start px-5 pt-6">
        <div className="border-border flex w-full flex-col items-start rounded-[12px] border p-3">
          <div className="flex w-full items-center justify-center">
            <Streamdown className="text-muted-foreground text-center font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[1.4] font-normal">
              {textContent}
            </Streamdown>
          </div>
        </div>
      </div>
    );
  }

  // AI message
  if (message.role === "assistant") {
    return (
      <div className="flex w-full flex-col items-start pt-6 pr-14 pl-3">
        <div className="flex w-full items-start gap-2">
          <AIAvatar />
          <div className="min-h-px min-w-px grow basis-0 overflow-hidden">
            <Streamdown className="text-foreground font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[1.4] font-normal">
              {textContent}
            </Streamdown>
          </div>
        </div>
      </div>
    );
  }

  // User message
  return (
    <div className="flex w-full flex-col items-end pt-6 pr-5 pb-0 pl-10">
      <div className="bg-secondary flex min-h-10 max-w-[80%] items-center overflow-hidden rounded-[20px] px-4 py-3">
        <Streamdown className="text-foreground font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[1.4] font-normal">
          {textContent}
        </Streamdown>
      </div>
    </div>
  );
};
