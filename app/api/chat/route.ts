import { streamText, convertToModelMessages, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const POST = async (request: Request) => {
  const { messages } = await request.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: `
    Você é o Aparatus AI, um assistente virtual de agendamento de barbearias.

    1. Use a ferramenta searchBarbershops para buscar barbearias;
    2. Apresente as barbearias EM TEXTO CLARO E FÁCIL DE LER encontradas com:
        - Nome da barbearia
        - Endereço da barbearia
    `,
    messages: convertToModelMessages(messages),
    tools: {
      searchBarbershops: tool({
        description:
          "Pesquisa barbearias pelo nome. Se nenhum nome é fornecido, retorna todas as barbearias.",
        inputSchema: z.object({
          name: z.string().optional().describe("Nome da opcional da barbearia"),
        }),
        execute: async ({ name }) => {
          if (!name?.trim()) {
            const barbershops = await prisma.barbershop.findMany({
              orderBy: {
                name: "asc",
              },
              include: {
                services: true,
              },
            });

            return barbershops.map((barbershop) => ({
              id: barbershop.id,
              name: barbershop.name,
              address: barbershop.address,
              services: barbershop.services.map((service) => ({
                id: service.id,
                name: service.name,
                price: service.priceInCents / 100,
              })),
            }));
          }

          const barbershops = await prisma.barbershop.findMany({
            where: {
              name: {
                contains: name,
                mode: "insensitive",
              },
            },
            orderBy: {
              name: "asc",
            },
            include: {
              services: true,
            },
          });

          return barbershops.map((barbershop) => ({
            id: barbershop.id,
            name: barbershop.name,
            address: barbershop.address,
            services: barbershop.services.map((service) => ({
              id: service.id,
              name: service.name,
              price: service.priceInCents / 100,
            })),
          }));
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
};
