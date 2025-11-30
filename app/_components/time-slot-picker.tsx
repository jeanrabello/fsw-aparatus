"use client";

import { Button } from "./ui/button";

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

interface TimeSlotPickerProps {
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onSelectTime: (time: string) => void;
}

export function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onSelectTime,
}: TimeSlotPickerProps) {
  if (!selectedDate) {
    return null;
  }

  return (
    <div className="scrollbar-hide flex gap-3 overflow-x-auto px-5 py-5">
      {TIME_SLOTS.map((time) => (
        <Button
          key={time}
          variant={selectedTime === time ? "default" : "outline"}
          size="sm"
          className="shrink-0 rounded-full"
          onClick={() => onSelectTime(time)}
        >
          {time}
        </Button>
      ))}
    </div>
  );
}
