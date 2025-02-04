import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TimePickerProps {
  time: string;
  onTimeChange: (time: string) => void;
  disableBefore?: string; // Time to disable slots before (e.g., "09:00")
  disableAfter?: string; // Time to disable slots after (e.g., "17:00")
  defaultPlaceHolder?: string;
  className?: string;
}

export const TimePicker = ({
  time,
  onTimeChange,
  disableBefore,
  disableAfter,
  defaultPlaceHolder = "Select Time",
  className,
}: TimePickerProps) => {
  // useState
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // useEffect
  useEffect(() => {
    setAvailableTimes(generateAvailableTimes());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableBefore, disableAfter]);

  // Handlers
  const isDisabled = (timeValue: string): boolean => {
    const [h2, m2] = timeValue.split(":").map(Number);

    if (disableBefore) {
      const [h1, m1] = disableBefore.split(":").map(Number);
      if (h2 < h1 || (h2 === h1 && m2 < m1)) return true;
    }

    if (disableAfter) {
      const [h1, m1] = disableAfter.split(":").map(Number);
      if (h2 > h1 || (h2 === h1 && m2 > m1)) return true;
    }

    return false;
  };

  // Function to generate available time slots based on disableBefore and disableAfter
  const generateAvailableTimes = () => {
    const times: string[] = [];
    for (let i = 0; i < 96; i++) {
      const hour = Math.floor(i / 4)
        .toString()
        .padStart(2, "0");
      const minute = ((i % 4) * 15).toString().padStart(2, "0");
      const timeValue = `${hour}:${minute}`;

      if (!isDisabled(timeValue)) {
        times.push(timeValue);
      }
    }
    return times;
  };

  const findValidDefaultTime = (defaultTime: string) => {
    if (availableTimes.includes(defaultTime)) {
      return defaultTime;
    }
    return availableTimes[0] || "";
  };

  // Variable
  const validDefaultTime = findValidDefaultTime(time);

  return (
    <Select value={validDefaultTime} onValueChange={onTimeChange}>
      <SelectTrigger className={cn("font-normal focus:ring-0 w-[120px]", className)}>
        <SelectValue placeholder={defaultPlaceHolder} />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[15rem]">
          {availableTimes.map((timeValue, i) => (
            <SelectItem key={i} value={timeValue}>
              {timeValue}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

export function AdjustTime(time: string, value: number): string {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;
  const adjustedMinutes = totalMinutes + value * 15;

  const newHours = Math.floor((adjustedMinutes / 60 + 24) % 24);
  const newMinutes = ((adjustedMinutes % 60) + 60) % 60;

  return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
}
