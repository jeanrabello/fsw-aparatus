"use client";

import { Button } from "./ui/button";

interface TimeSlotPickerProps {
  availableTimeSlots?: string[];
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onSelectTime: (time: string) => void;
}

export function TimeSlotPicker({
  availableTimeSlots,
  selectedDate,
  selectedTime,
  onSelectTime,
}: TimeSlotPickerProps) {
  if (!selectedDate) {
    return null;
  }

  const hasAvailableTimeSlots =
    availableTimeSlots && availableTimeSlots.length > 0;

  return (
    <div className="scrollbar-hide flex gap-3 overflow-x-auto px-5 py-5">
      {hasAvailableTimeSlots ? (
        availableTimeSlots?.map((time) => (
          <Button
            key={time}
            variant={selectedTime === time ? "default" : "outline"}
            size="sm"
            className="shrink-0 rounded-full"
            onClick={() => onSelectTime(time)}
          >
            {time}
          </Button>
        ))
      ) : (
        <p className="text-muted-foreground w-full text-center">
          There are no available time slots for this date
        </p>
      )}
    </div>
  );
}
