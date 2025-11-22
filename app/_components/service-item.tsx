import Image from "next/image";
import { BarbershopService } from "../generated/prisma/client";
import { Button } from "./ui/button";

interface ServiceItemProps {
  service: BarbershopService;
}

export function ServiceItem({ service }: ServiceItemProps) {
  const priceInReais = (service.priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="bg-card border border-border flex gap-3 items-center p-3 rounded-2xl">
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
      <div className="flex flex-col flex-1 h-full justify-between self-stretch">
        {/* Nome e descrição */}
        <div className="flex flex-col gap-1 h-[67.5px]">
          <p className="text-sm font-bold leading-[1.4]">{service.name}</p>
          <p className="text-sm text-muted-foreground leading-[1.4]">
            {service.description}
          </p>
        </div>

        {/* Preço e botão */}
        <div className="flex items-center justify-between w-full">
          <p className="text-sm font-bold leading-[1.4]">{priceInReais}</p>
          <Button size="sm" className="rounded-full px-4 py-2">
            Reservar
          </Button>
        </div>
      </div>
    </div>
  );
}
