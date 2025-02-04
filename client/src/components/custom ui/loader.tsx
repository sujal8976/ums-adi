import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

interface LoaderProps {
  size?: number;
  stroke?: number;
  className?: string;
}
export const Loader: React.FC<LoaderProps> = ({
  size = 48,
  stroke = 2.5,
  className,
  ...props
}) => {
  return (
    <LoaderCircle
      size={size}
      strokeWidth={stroke}
      className={cn("mx-auto animate-spin", className)}
      {...props}
    />
  );
};
