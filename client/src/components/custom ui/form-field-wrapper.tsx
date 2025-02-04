import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  LabelText: string;
  LabelFor?: string;
  Important?: boolean;
  ImportantSide?: "left" | "right";
  LabelStyles?: string;
  ImportantStyles?: string;
}
export const FormFieldWrapper = ({
  children,
  LabelText,
  LabelFor,
  Important = false,
  ImportantSide = "left",
  className,
  LabelStyles,
  ImportantStyles,
  ...props
}: FormFieldWrapperProps) => (
  <div className={cn("w-full flex flex-col gap-4 px-1", className)} {...props}>
    <Label className={cn("font-semibold", LabelStyles)} htmlFor={LabelFor}>
      {Important && ImportantSide == "left" && (
        <span className={cn("text-red-500 mr-2", ImportantStyles)}>*</span>
      )}
      {LabelText}
      {Important && ImportantSide == "right" && (
        <span className={cn("text-red-500 ml-2", ImportantStyles)}>*</span>
      )}
    </Label>
    {children}
  </div>
);
