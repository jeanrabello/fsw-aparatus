"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";

interface PhoneCopyButtonProps {
  phone: string;
}

export function PhoneCopyButton({ phone }: PhoneCopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(phone);
    toast.success("Telefone copiado!");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full"
      onClick={handleCopy}
    >
      Copiar
    </Button>
  );
}
