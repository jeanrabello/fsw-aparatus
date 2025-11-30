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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleConfirm = () => {
    console.log("Booking:", {
      service,
      barbershop,
      selectedDate,
      selectedTime,
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Sheet onOpenChange={handleSheetOpenChange}>
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
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                />
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
              disabled={!selectedDate || !selectedTime}
              onClick={handleConfirm}
            >
              Confirmar
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
