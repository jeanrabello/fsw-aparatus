"use server";

import { actionClient } from "@/lib/action-client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { returnValidationErrors } from "next-safe-action";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const inputSchema = z.object({
  serviceId: z.uuid(),
  date: z.date(),
});

export const createBooking = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const { serviceId, date } = parsedInput;

    // Verify if service exists
    const service = await prisma.barbershopService.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      returnValidationErrors(inputSchema, {
        _errors: ["Serviço não encontrado"],
      });
    }

    // Verify if exists a booking at the same date
    const existingBooking = await prisma.booking.findFirst({
      where: {
        barbershopId: service.barbershopId,
        date,
      },
    });

    if (existingBooking) {
      console.error("Já existe um agendamento para esta data");
      returnValidationErrors(inputSchema, {
        _errors: ["Já existe um agendamento para esta data"],
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        serviceId: service.id,
        barbershopId: service.barbershopId,
        date,
        userId: session.user.id,
      },
    });

    revalidatePath("/bookings");

    return booking;
  });
