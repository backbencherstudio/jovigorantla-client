import * as React from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  onComplete?: (value: string) => void;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  ({ length = 6, onComplete, value, onChange, disabled = false }, ref) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    const focusInput = (targetIndex: number) => {
      if (targetIndex >= 0 && targetIndex < length) {
        inputRefs.current[targetIndex]?.focus();
      }
    };

    const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Backspace" && !value[index] && index > 0) {
        focusInput(index - 1);
      }
    };

    const handleChange = (
      index: number,
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const newValue = e.target.value;
      if (newValue.length > 1) return; // Prevent pasting multiple characters

      const newOTP = value.split("");
      newOTP[index] = newValue;
      const updatedOTP = newOTP.join("");
      onChange(updatedOTP);

      if (newValue && index < length - 1) {
        focusInput(index + 1);
      }

      if (updatedOTP.length === length && onComplete) {
        onComplete(updatedOTP);
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
      if (pastedData.length > 0) {
        onChange(pastedData.padEnd(length, ""));
        if (pastedData.length === length && onComplete) {
          onComplete(pastedData);
        }
      }
    };

    return (
      <div ref={ref} className="flex gap-2 justify-center">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ""}
            disabled={disabled}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              "w-12 h-12 text-center text-xl font-semibold rounded-xl border bg-[#e6eaed] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
        ))}
      </div>
    );
  }
);

OTPInput.displayName = "OTPInput";

export { OTPInput };
