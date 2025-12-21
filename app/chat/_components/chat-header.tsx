"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";

export const ChatHeader = () => {
  return (
    <div className="flex items-center justify-between pt-[24px] pb-0 px-[20px] shrink-0 w-full">
      <Link href="/">
        <Button variant="ghost" size="icon">
          <ChevronLeft className="size-[24px]" />
        </Button>
      </Link>
      <p className="font-['Merriweather',serif] italic text-[20px] text-foreground tracking-[-1px] leading-[1.4]">
        Aparatus.ai
      </p>
      <div className="size-[24px]" />
    </div>
  );
};
