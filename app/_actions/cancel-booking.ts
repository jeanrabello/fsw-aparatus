"use server";

import { actionClient } from "@/lib/action-client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { returnValidationErrors } from "next-safe-action";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import Stripe from "stripe";

const inputSchema = z.object({
  bookingId: z.string().uuid(),
});

export const cancelBooking = actionClient
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

    const { bookingId } = parsedInput;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      returnValidationErrors(inputSchema, {
        _errors: ["Agendamento não encontrado"],
      });
    }

    if (booking.date < new Date()) {
      returnValidationErrors(inputSchema, {
        _errors: ["Não é possível cancelar um agendamento passado"],
      });
    }

    if (booking.userId !== session.user.id) {
      returnValidationErrors(inputSchema, {
        _errors: ["Você não tem permissão para cancelar este agendamento"],
      });
    }

    if (booking.cancelled) {
      returnValidationErrors(inputSchema, {
        _errors: ["Este agendamento já foi cancelado"],
      });
    }

    if (booking.stripeChargeId) {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is not set");
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-07-30.basil",
      });

      await stripe.refunds.create({
        charge: booking.stripeChargeId,
        reason: "requested_by_customer",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        cancelled: true,
        cancelledAt: new Date(),
      },
    });

    revalidatePath("/bookings");

    return updatedBooking;
  });
