import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface AutoExpandingInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  maxLength?: number;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  name?: string;
  className?: string;
}

const AutoExpandingInput = ({
  value,
  onChange,
  placeholder = "",
  maxLength,
  onBlur,
  name,
  className = "",
}: AutoExpandingInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Adjust height on mount and when content changes
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Set the height to scrollHeight to expand as content grows
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
      placeholder={placeholder}
      maxLength={maxLength}
      onBlur={onBlur}
      name={name}
      className={`bg-[#e5ebee] focus-visible:outline-none ring-[#ff6b00] focus-visible:ring-[0.75px] rounded-lg text-sm placeholder:text-[#64748b] w-full p-3 resize-none overflow-hidden ${className}`}
      rows={1}
    />
  );
};

// How to use it in your form:
// Replace your Input component with this example
/*
<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem className="relative">
      <FormLabel className="text-black">Title</FormLabel>
      <FormControl>
        <div className="space-y-1">
          <AutoExpandingInput
            value={field.value}
            onChange={(e) => {
              handleTitleChange(e);
              field.onChange(e);
            }}
            placeholder="Enter a descriptive title"
            maxLength={MAX_TITLE_LENGTH}
            onBlur={field.onBlur}
            name={field.name}
          />
          <div className="flex justify-end">
            <span className="text-xs text-gray-400">
              {titleLength}/{MAX_TITLE_LENGTH}
            </span>
          </div>
        </div>
      </FormControl>
      <FormMessage className="text-xs font-normal absolute -bottom-1 text-[#b3261e]" />
    </FormItem>
  )}
/>
*/

export default AutoExpandingInput;
