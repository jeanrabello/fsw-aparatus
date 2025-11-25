"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { authClient } from "@/lib/auth-client";
import {
  CalendarDaysIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";

const MENU_ITEMS = [
  {
    label: "Início",
    icon: HomeIcon,
    href: "/",
  },
  {
    label: "Agendamentos",
    icon: CalendarDaysIcon,
    href: "/bookings",
  },
];

const SERVICE_CATEGORIES = [
  "Cabelo",
  "Barba",
  "Acabamento",
  "Sombrancelha",
  "Massagem",
  "Hidratação",
];

export function MenuSheet() {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleLogout = async () => {
    await authClient.signOut();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[370px] overflow-y-auto">
        <SheetHeader className="flex-row items-center justify-between px-5 py-6">
          <SheetTitle className="text-lg">Menu</SheetTitle>
          <SheetClose className="focus:ring-ring rounded-lg p-2.5 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>
        <Separator />

        <div className="flex flex-col gap-6">
          {/* User Section or Login Section */}
          <div>
            {isLoggedIn ? (
              <div className="flex items-center gap-3 px-5 pt-6">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={session.user.image || ""}
                    alt={session.user.name || ""}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-foreground text-base leading-[1.4] font-semibold">
                    {session.user.name}
                  </span>
                  <span className="text-muted-foreground text-xs leading-[1.4]">
                    {session.user.email}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-5 pt-6">
                <span className="text-foreground text-base font-semibold">
                  Olá. Faça seu login!
                </span>
                <Button
                  onClick={handleLogin}
                  className="gap-3 rounded-full px-6 py-3"
                >
                  <span className="text-sm font-semibold">Login</span>
                  <LogInIcon size={16} />
                </Button>
              </div>
            )}
          </div>

          {/* Primary Navigation */}
          <div>
            <nav className="flex flex-col">
              {MENU_ITEMS.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  size={null}
                  className="justify-start gap-3 rounded-[82px] px-5 py-3"
                >
                  <Link href={item.href}>
                    <item.icon size={16} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </Button>
              ))}
            </nav>
          </div>

          <Separator />

          {/* Service Categories */}
          <div>
            <nav className="flex flex-col gap-1">
              {SERVICE_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  asChild
                  variant="ghost"
                  size={null}
                  className="justify-start gap-3 rounded-[82px] px-5 py-3"
                >
                  <Link href={`/barbershops?search=${category.toLowerCase()}`}>
                    <span className="text-sm font-medium">{category}</span>
                  </Link>
                </Button>
              ))}
            </nav>
          </div>

          <Separator />

          {/* Logout */}
          <div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size={null}
              className="text-muted-foreground w-full justify-start gap-3 rounded-[82px] px-5 py-3"
            >
              <LogOutIcon size={16} />
              <span className="text-sm font-medium">Sair da conta</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
