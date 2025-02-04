import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

interface ToggleGroupProps extends React.HTMLAttributes<HTMLElement> {
  options: Option[];
  defaultValue: string;
  value: string;
  setValue: (value: string) => void;
  className?: string;
  btnClassName?: string;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options,
  defaultValue,
  value,
  setValue,
  className = "",
  btnClassName = "",
  ...props
}) => {
  const [currOption, setCurrOption] = useState(defaultValue);

  useEffect(() => {
    setCurrOption(value);
  }, [value]);

  const handleBtnClick = (value: string) => {
    if (value === currOption) return;
    setValue(value);
    setCurrOption(value);
  };

  return (
    <div
      className={cn(`flex items-center overflow-hidden rounded-md border-2`, className)}
      {...props}
    >
      {options.map((option, index) => (
        <button
          key={index}
          className={cn(
            `${BtnStyles} ${
              option.value === currOption ? "bg-primary text-secondary hover:bg-primary" : ""
            } ${index < options.length - 1 ? "border-r-2" : ""}`,
            btnClassName
          )}
          onClick={() => handleBtnClick(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

const BtnStyles = "text-sm p-1.5 px-3 font-semibold transition-all hover:bg-muted/80";
