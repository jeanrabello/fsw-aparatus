"use client";

import { useState } from "react";
import { BarbershopService } from "../generated/prisma/client";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { XIcon } from "lucide-react";
import { TimeSlotPicker } from "./time-slot-picker";
import { BookingConfirmation } from "./booking-confirmation";
import { ptBR } from "date-fns/locale";
import { useAction } from "next-safe-action/hooks";
import { createBooking } from "../_actions/create-booking";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getDateAvailableTimeSlots } from "../_actions/get-date-available-time-slots";
import { Spinner } from "./ui/spinner";
import { createBookingCheckoutSession } from "../_actions/create-booking-checkout-session";
import { loadStripe } from "@stripe/stripe-js";

interface BookingSheetProps {
  service: BarbershopService;
  barbershop: {
    id: string;
    name: string;
  };
  children: React.ReactNode;
}

export function BookingSheet({
  service,
  barbershop,
  children,
}: BookingSheetProps) {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const { isPending } = useAction(createBooking);
  const { executeAsync: executeCreateBookingCheckoutSession } = useAction(
    createBookingCheckoutSession,
  );
  const { data: availableTimeSlots, isPending: isPendingTimeSlots } = useQuery({
    queryKey: ["date-available-time-slots", service.barbershopId, selectedDate],
    queryFn: () =>
      getDateAvailableTimeSlots({
        barbershopId: service.barbershopId,
        date: selectedDate!,
      }),
    enabled: Boolean(selectedDate),
  });

  const isConfirmDisabled = !selectedDate || !selectedTime || isPending;

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    }
    setSheetIsOpen(open);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleConfirm = async () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      toast.error("Erro ao criar a sessão de pagamento");
      return;
    }

    if (!selectedDate || !selectedTime) {
      return;
    }

    // Combine selected date and time into a single Date object
    const timeSplitted = selectedTime?.split(":");
    const hours = Number(timeSplitted[0]);
    const minutes = Number(timeSplitted[1]);

    const date = new Date(selectedDate);
    date.setHours(hours, minutes, 0, 0);

    const checkoutSessionResult = await executeCreateBookingCheckoutSession({
      serviceId: service.id,
      date,
    });

    if (
      checkoutSessionResult.serverError ||
      checkoutSessionResult.validationErrors
    ) {
      toast.error(checkoutSessionResult.validationErrors?._errors?.[0]);
      return;
    }

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    );

    if (!stripe || !checkoutSessionResult?.data?.id) {
      toast.error("Erro ao inicializar o Stripe");
      return;
    }

    await stripe.redirectToCheckout({
      sessionId: checkoutSessionResult.data.id,
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <Sheet open={sheetIsOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-full w-full flex-col overflow-hidden sm:w-[390px]"
      >
        <SheetHeader className="flex-row items-center justify-between p-0 px-5 pt-6">
          <SheetTitle className="text-lg">Fazer Reserva</SheetTitle>
          <SheetClose className="focus:ring-ring rounded-lg p-2.5 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none">
            <XIcon className="size-4" />
            <span className="sr-only">Fechar</span>
          </SheetClose>
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-3 px-5">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < today}
              className="w-full"
              locale={ptBR}
            />
          </div>

          {selectedDate && (
            <>
              <Separator />
              <div className="flex flex-col gap-3">
                {isPendingTimeSlots ? (
                  <div className="flex w-full items-center justify-center gap-2 py-5">
                    <Spinner />
                    <p className="text-muted-foreground">
                      Loading time slots...
                    </p>
                  </div>
                ) : (
                  <TimeSlotPicker
                    availableTimeSlots={availableTimeSlots?.data}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onSelectTime={setSelectedTime}
                  />
                )}
              </div>
            </>
          )}

          {selectedDate && selectedTime && (
            <>
              <Separator />
              <div className="flex flex-col gap-3 px-5 py-6">
                <BookingConfirmation
                  service={service}
                  barbershopName={barbershop.name}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                />
              </div>
            </>
          )}
        </div>

        {selectedDate && selectedTime && (
          <SheetFooter className="mt-0 shrink-0 px-5 pb-5">
            <Button
              className="w-full rounded-full"
              disabled={isConfirmDisabled}
              onClick={handleConfirm}
            >
              {isPending ? "Confirmando..." : "Confirmar Reserva"}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
