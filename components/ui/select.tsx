import * as React from "react";
import { cn } from "@/lib/utils";

// A lightweight native <select> wrapper instead of the full Radix Select
// primitive — for filter chips and onboarding forms, native select gives
// better mobile UX (the OS-native picker) at a fraction of the code/JS.
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-9 rounded-md border border-border bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
