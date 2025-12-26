"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { MenuSheet } from "./menu-sheet";

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-white px-5 py-6">
      <Link href="/">
        <Image src="/logo.svg" alt="Aparatus" width={100} height={26.09} />
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/chat">
          <Button variant="outline" size="icon">
            <MessageCircle />
          </Button>
        </Link>
        <MenuSheet />
      </div>
    </header>
  );
};

export default Header;
