import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, type, label, id, ...props }, ref) => {
    const [inputId] = React.useState(
      () => id || `floating-input-${Math.random().toString(36).substr(2, 9)}`
    );

    return (
      <div className="relative">
        <input
          id={inputId}
          type={type}
          className={cn(
            "peer h-12 w-full rounded-2xl border border-input  px-3 pt-4 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-[0.75px] focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-[#e5ebee]",
            className
          )}
          ref={ref}
          placeholder={label}
          {...props}
        />
        <label
          htmlFor={inputId}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs peer-focus:text-foreground peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-foreground cursor-text"
        >
          {label}
        </label>
      </div>
    );
  }
);
FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
