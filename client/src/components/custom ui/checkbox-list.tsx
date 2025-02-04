import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface CheckboxListProps {
  options: Option[];
  selectedValues: string[];
  setSelectedValues: (value: string[]) => void;
  className?: string;
  isEditable?: boolean;
}

const CheckboxList: React.FC<CheckboxListProps> = ({
  options,
  selectedValues,
  setSelectedValues,
  className,
  isEditable = true,
  ...props
}) => {
  const handleCheckboxChange = (value: string) => {
    setSelectedValues(
      selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value],
    );
  };

  return (
    <div className={cn("flex flex-col space-y-4", className)} {...props}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Checkbox
            id={option.value}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={() => handleCheckboxChange(option.value)}
            disabled={!isEditable}
          />
          <Label
            htmlFor={option.value}
            className={`text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${!selectedValues.includes(option.value) && "text-primary/30"}`}
          >
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxList;
