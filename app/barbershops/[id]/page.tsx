import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Smartphone } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Separator } from "@/app/_components/ui/separator";
import { ServiceItem } from "@/app/_components/service-item";
import { PhoneCopyButton } from "@/app/_components/phone-copy-button";

const BarbershopPage = async (props: PageProps<"/barbershops/[id]">) => {
  const { id } = await props.params;

  const barbershop = await prisma.barbershop.findUnique({
    where: { id },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      {/* Banner com Header */}
      <div className="relative h-[297px] w-full">
        <Image
          src={barbershop.imageUrl}
          alt={barbershop.name}
          fill
          className="object-cover"
          priority
        />

        {/* Header com botão voltar */}
        <div className="absolute top-0 right-0 left-0 flex items-start p-5">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full"
            asChild
          >
            <Link href="/">
              <ChevronLeft className="size-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Container principal */}
      <div className="bg-background relative -mt-6 rounded-tl-3xl rounded-tr-3xl">
        {/* Info da Barbearia */}
        <div className="px-5 pt-6 pb-0">
          <div className="flex items-start gap-1.5">
            <div className="relative size-[30px] shrink-0 overflow-hidden rounded-full">
              <Image
                src={barbershop.imageUrl}
                alt={barbershop.name}
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-xl font-bold">{barbershop.name}</h1>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            {barbershop.address}
          </p>
        </div>

        {/* Separator */}
        <div className="px-0 py-6">
          <Separator />
        </div>

        {/* Sobre Nós */}
        <div className="flex flex-col gap-3 px-5">
          <h2 className="text-xs font-bold uppercase">SOBRE NÓS</h2>
          <p className="text-sm leading-[1.4]">{barbershop.description}</p>
        </div>

        {/* Separator */}
        <div className="px-0 py-6">
          <Separator />
        </div>

        {/* Serviços */}
        <div className="flex flex-col gap-3 px-5">
          <h2 className="text-xs font-bold uppercase">SERVIÇOS</h2>
          <div className="flex flex-col gap-3">
            {barbershop.services.map((service) => (
              <ServiceItem key={service.id} service={service} />
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="px-0 py-6">
          <Separator />
        </div>

        {/* Contato */}
        <div className="flex flex-col gap-3 px-5">
          <h2 className="text-xs font-bold uppercase">CONTATO</h2>
          {barbershop.phones.map((phone, index) => (
            <div
              key={index}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="size-6" />
                <p className="text-sm">{phone}</p>
              </div>
              <PhoneCopyButton phone={phone} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-[60px]">
          <div className="bg-secondary flex flex-col gap-1.5 px-[30px] py-8 text-xs">
            <p className="font-semibold">© 2025 Copyright Aparatus</p>
            <p className="text-muted-foreground">
              Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarbershopPage;
