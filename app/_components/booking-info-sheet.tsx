"use client";

import { useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

const TIMEZONE = "America/Sao_Paulo";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import Image from "next/image";
import { XIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button, buttonVariants } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { PhoneItem } from "./phone-item";
import { cancelBooking } from "../_actions/cancel-booking";

interface BookingInfoSheetProps {
  booking: {
    id: string;
    date: Date;
    cancelled: boolean | null;
    service: {
      name: string;
      priceInCents: number;
    };
    barbershop: {
      name: string;
      address: string;
      imageUrl: string;
      phones: string[];
    };
  };
  children: React.ReactNode;
}

export function BookingInfoSheet({ booking, children }: BookingInfoSheetProps) {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const { executeAsync, isPending } = useAction(cancelBooking);

  const status = booking.cancelled
    ? "CANCELADO"
    : new Date(booking.date) > new Date()
      ? "CONFIRMADO"
      : "FINALIZADO";
  const badgeClassName =
    status === "CONFIRMADO"
      ? "bg-primary/10 text-primary border-transparent"
      : "bg-muted-foreground/10 text-muted-foreground border-transparent";
  const isFuture = status === "CONFIRMADO";

  const formattedPrice = (booking.service.priceInCents / 100).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  );

  const formattedDate = formatInTimeZone(
    new Date(booking.date),
    TIMEZONE,
    "d 'de' MMMM",
    { locale: ptBR },
  );
  const formattedTime = formatInTimeZone(
    new Date(booking.date),
    TIMEZONE,
    "HH:mm",
    { locale: ptBR },
  );

  const handleSheetOpenChange = (open: boolean) => {
    setSheetIsOpen(open);
  };

  const handleCancelBooking = async () => {
    const result = await executeAsync({ bookingId: booking.id });

    if (result?.serverError || result?.validationErrors) {
      toast.error(
        result.validationErrors?._errors?.[0] || "Erro ao cancelar agendamento",
      );
      return;
    }

    toast.success("Agendamento cancelado com sucesso!");
    setSheetIsOpen(false);
  };

  return (
    <Sheet open={sheetIsOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-full w-full flex-col overflow-hidden sm:w-[390px]"
      >
        <SheetHeader className="flex-row items-center justify-between px-5 pt-6">
          <SheetTitle className="text-lg">Informações da Reserva</SheetTitle>
          <SheetClose className="focus:ring-ring rounded-lg p-2.5 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none">
            <XIcon className="size-4" />
            <span className="sr-only">Fechar</span>
          </SheetClose>
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto">
          <div className="px-5">
            <div className="relative h-[180px] w-full overflow-hidden rounded-lg">
              <Image src="/map.png" alt="Map" fill className="object-cover" />
              <div className="absolute inset-0 flex items-end justify-center p-5">
                <div className="bg-background flex items-center gap-3 rounded-lg px-5 py-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      src={booking.barbershop.imageUrl}
                      alt={booking.barbershop.name}
                    />
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-base font-bold">
                      {booking.barbershop.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {booking.barbershop.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-5 pt-6">
            <Badge className={badgeClassName}>{status}</Badge>

            <div className="border-border bg-card flex flex-col gap-3 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold">{booking.service.name}</p>
                <p className="text-sm font-bold">{formattedPrice}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Data</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Horário</span>
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Barbearia</span>
                <span>{booking.barbershop.name}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-5 pt-6">
            {booking.barbershop.phones.map((phone, index) => (
              <PhoneItem key={index} phone={phone} />
            ))}
          </div>
        </div>

        <SheetFooter className="mt-0 flex shrink-0 flex-row gap-3 px-5 pb-5">
          <SheetClose asChild>
            <Button variant="outline" className="flex-1 rounded-full">
              Voltar
            </Button>
          </SheetClose>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="flex-1 rounded-full"
                disabled={isPending || !isFuture || !!booking.cancelled}
              >
                {isPending ? "Cancelando..." : "Cancelar Reserva"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja cancelar este agendamento? Esta ação
                  não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Voltar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelBooking}
                  className={buttonVariants({ variant: "destructive" })}
                >
                  Confirmar Cancelamento
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
