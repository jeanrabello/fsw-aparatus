"use client";

import Image from "next/image";
import { BarbershopService } from "../generated/prisma/client";
import { Button } from "./ui/button";
import { BookingSheet } from "./booking-sheet";

interface ServiceItemProps {
  service: BarbershopService;
  barbershop: {
    id: string;
    name: string;
  };
}

export function ServiceItem({ service, barbershop }: ServiceItemProps) {
  const priceInReais = (service.priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="bg-card border-border flex items-center gap-3 rounded-2xl border p-3">
      {/* Imagem à esquerda */}
      <div className="relative size-[110px] shrink-0 overflow-hidden rounded-[10px]">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Informações à direita */}
      <div className="flex h-full flex-1 flex-col justify-between self-stretch">
        {/* Nome e descrição */}
        <div className="flex h-[67.5px] flex-col gap-1">
          <p className="text-sm leading-[1.4] font-bold">{service.name}</p>
          <p className="text-muted-foreground text-sm leading-[1.4]">
            {service.description}
          </p>
        </div>

        {/* Preço e botão */}
        <div className="flex w-full items-center justify-between">
          <p className="text-sm leading-[1.4] font-bold">{priceInReais}</p>
          <BookingSheet service={service} barbershop={barbershop}>
            <Button size="sm" className="rounded-full px-4 py-2">
              Reservar
            </Button>
          </BookingSheet>
        </div>
      </div>
    </div>
  );
}
