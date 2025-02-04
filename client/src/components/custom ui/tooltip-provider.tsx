import React, { forwardRef, Ref } from "react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Tooltip = forwardRef(function Tooltip(
  {
    content,
    children,
    side = "top",
  }: {
    content: string;
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
  },
  ref: Ref<HTMLButtonElement>,
) {
  return (
    <TooltipProvider>
      <UITooltip>
        <TooltipTrigger asChild ref={ref}>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} className=" mb-3 mx-2">
          <p>{content}</p>
        </TooltipContent>
      </UITooltip>
    </TooltipProvider>
  );
});
