import * as React from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  InputProps & { wrapperClassName?: string; disabled?: boolean }
>(({ className, wrapperClassName, disabled = false, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={cn("relative", wrapperClassName)}>
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("hide-password-toggle pr-10", className)}
        ref={ref}
        disabled={disabled}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-red"
        disabled={disabled}
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>

      {/* hides browsers password toggles */}
      <style>{`
          .hide-password-toggle::-ms-reveal,
          .hide-password-toggle::-ms-clear {
            visibility: hidden;
            pointer-events: none;
            display: none;
          }
        `}</style>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };
