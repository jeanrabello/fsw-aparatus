"use client";

import { Smartphone } from "lucide-react";
import { PhoneCopyButton } from "./phone-copy-button";

interface PhoneItemProps {
  phone: string;
}

export function PhoneItem({ phone }: PhoneItemProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Smartphone className="size-6" />
        <p className="text-sm">{phone}</p>
      </div>
      <PhoneCopyButton phone={phone} />
    </div>
  );
}
