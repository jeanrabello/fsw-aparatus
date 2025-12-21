"use client";

import { Mic, Send } from "lucide-react";
import { KeyboardEvent } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  disabled,
}: ChatInputProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  return (
    <div className="bg-border absolute right-0 bottom-0 left-0 flex w-full flex-col items-start p-5">
      <div className="flex w-full items-center gap-2">
        <Input
          type="text"
          placeholder="Digite sua mensagem"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="bg-background placeholder:text-muted-foreground min-h-px min-w-px grow basis-0 rounded-full px-4 py-3 text-[14px]"
        />
        <Button
          variant="default"
          size="icon"
          disabled
          className="bg-primary size-[42px] shrink-0 rounded-full p-2.5"
        >
          <Mic className="size-5" />
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="bg-primary size-[42px] shrink-0 rounded-full p-2.5"
        >
          <Send className="size-5" />
        </Button>
      </div>
    </div>
  );
};
