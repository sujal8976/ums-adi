import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DatePicker } from "./date-picker";
import { TimePicker } from "./time-picker";

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  disableDates?: "past" | "present" | "future" | null;
  className?: string;
  defaultDate?: Date;
  onDateChange: (date: Date) => void;
}

export function DateTimePicker({
  className,
  defaultDate,
  onDateChange,
  disableDates = null,
}: DatePickerProps) {
  const [time, setTime] = useState<string>("00:00");
  const [date, setDate] = useState<Date>(new Date());

  const handleDateChange = (selectedDate: Date) => {
    if (selectedDate instanceof Date) {
      const [hours, minutes] = time.split(":");
      const combinedDate = new Date(selectedDate.getTime());
      combinedDate.setHours(parseInt(hours), parseInt(minutes));
      setDate(combinedDate);
      console.log(combinedDate);
      onDateChange(combinedDate);
    }
  };

  const handleTimeChange = (selectedTime: string) => {
    setTime(selectedTime);
    const combinedDate = new Date(date.getTime());
    const [hours, minutes] = selectedTime.split(":");
    combinedDate.setHours(parseInt(hours), parseInt(minutes));
    setDate(combinedDate);
    onDateChange(combinedDate);
  };

  useEffect(() => {
    if (defaultDate instanceof Date) {
      setDate(defaultDate);
    }
  }, [defaultDate]);

  return (
    <div className={cn("flex w-full gap-4", className)}>
      <DatePicker
        disableDates={disableDates}
        defaultDate={date}
        onDateChange={handleDateChange}
      />

      <TimePicker
        time={time}
        onTimeChange={(selectedTime) => handleTimeChange(selectedTime)}
        disableBefore="09:00" // Example: disable times before 9 AM
        disableAfter="17:00"
      />
    </div>
  );
}
