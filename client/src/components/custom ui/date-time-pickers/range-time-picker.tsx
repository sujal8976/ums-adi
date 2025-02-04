import React, { useState, useEffect } from "react";
import { DateRange, isDateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { DatePicker } from "./date-picker";
import { TimePicker, AdjustTime } from "./time-picker";

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  disableDates?: "past" | "present" | "future" | null;
  className?: string;
  defaultDate?: DateRange;
  onDateChange: (date: DateRange) => void;
}

export function DateTimeRangePicker({
  className,
  defaultDate,
  onDateChange,
  disableDates = null,
}: DatePickerProps) {
  // useStates
  const [startTime, setStartTime] = useState<string>("00:00");
  const [endTime, setEndTime] = useState<string>("00:00");
  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });

  // useEffect to handle defaultDate
  useEffect(() => {
    if (isDateRange(defaultDate)) {
      if (defaultDate.from && defaultDate.to) {
        setDate(defaultDate);
      }
    }
  }, [defaultDate]);

  useEffect(() => {
    if (date.from && date.to) {
      const updatedDates = updateCombinedDates(date.from, date.to);
      if (validateDateRange(updatedDates)) {
        onDateChange(updatedDates);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime, date]);

  // Handlers
  const handleDateChange = (selectedDate: Date) => {
    if (selectedDate instanceof Date) {
      setDate((prev) => ({ ...prev, from: selectedDate, to: selectedDate }));
    }
  };

  const updateCombinedDates = (startDate: Date, endDate: Date) => {
    const startCombinedDate = new Date(startDate);
    const endCombinedDate = new Date(endDate);

    // Set the hours for start and end based on the time state
    startCombinedDate.setHours(
      parseInt(startTime.split(":")[0]),
      parseInt(startTime.split(":")[1]),
    );
    endCombinedDate.setHours(
      parseInt(endTime.split(":")[0]),
      parseInt(endTime.split(":")[1]),
    );

    return { from: startCombinedDate, to: endCombinedDate };
  };

  const validateDateRange = (dateRange: DateRange) => {
    const { from, to } = dateRange;

    if (from && to) {
      if (from < to) {
        return true;
      }
    }
    return false;
  };

  const handleStartTimeChange = (selectedTime: string) => {
    setStartTime(selectedTime);
  };

  const handleEndTimeChange = (selectedTime: string) => {
    setEndTime(selectedTime);
  };

  const handleAdjustTime = (time: string, value: number) => {
    return AdjustTime(time, value);
  };

  return (
    <div className={cn("flex w-full gap-2 items-center flex-wrap", className)}>
      <DatePicker
        disableDates={disableDates}
        defaultDate={date.from}
        onDateChange={handleDateChange}
        className="w-full md:max-w-[200px] flex-grow"
      />
      <span className="flex gap-2 items-center flex-grow">
        <TimePicker
          time={startTime}
          onTimeChange={handleStartTimeChange}
          defaultPlaceHolder="Start"
          disableAfter={handleAdjustTime(endTime, -1)}
          className="w-[90px] flex-grow"
        />
        <span className="font-semibold">-</span>
        <TimePicker
          time={endTime}
          onTimeChange={handleEndTimeChange}
          defaultPlaceHolder="End"
          className="w-[90px] flex-grow"
          disableBefore={handleAdjustTime(startTime, 1)}
        />
      </span>
    </div>
  );
}
