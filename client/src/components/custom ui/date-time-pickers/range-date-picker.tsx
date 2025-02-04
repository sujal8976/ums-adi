import React, { useState, useEffect } from "react";
import { addDays, isBefore, format, isAfter } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange, isDateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  disableDates?: "past" | "present" | "future" | null;
  className?: string;
  defaultDate?: DateRange;
  onDateChange: (date: DateRange) => void;
}
export function DatePickerWithRange({
  disableDates = null,
  defaultDate,
  onDateChange,
  className,
}: DatePickerProps) {
  // Variables
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // useStates
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });

  // useEffects
  useEffect(() => {
    if (isDateRange(defaultDate)) setDate(defaultDate);
  }, [defaultDate]);

  // Handlers
  const disableDate = (date: Date) => {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    if (disableDates === "past") return isBefore(date, startOfToday);
    if (disableDates === "present") {
      return !(isBefore(date, startOfToday) || isAfter(date, startOfToday));
    }
    if (disableDates === "future") return isAfter(date, startOfToday);
    return false;
  };

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onDateChange(selectedDate);
    }
  };

  return (
    <div className={cn("grid gap-2 w-[300px]", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={isDesktop ? 2 : 1}
            disabled={disableDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
