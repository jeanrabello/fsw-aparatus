"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "./ui/separator";

interface BookingConfirmationProps {
  service: {
    name: string;
    imageUrl: string;
    priceInCents: number;
  };
  barbershopName: string;
  selectedDate: Date;
  selectedTime: string;
}

export function BookingConfirmation({
  service,
  barbershopName,
  selectedDate,
  selectedTime,
}: BookingConfirmationProps) {
  const formattedPrice = (service.priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const formattedDate = format(selectedDate, "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return (
    <div className="bg-card border-border flex flex-col gap-3 rounded-2xl border p-4">
      <div className="flex items-center gap-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold">{service.name}</p>
          <p className="text-sm font-bold">{formattedPrice}</p>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Data</span>
          <span className="text-sm">{formattedDate}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Horário</span>
          <span className="text-sm">{selectedTime}</span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">Barbearia</span>
        <span className="text-sm">{barbershopName}</span>
      </div>
    </div>
  );
}
