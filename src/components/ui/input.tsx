import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

const baseClasses =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-title placeholder:text-description/50 focus:border-tiffany focus:outline-none focus:ring-1 focus:ring-tiffany/50 transition-colors";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input ref={ref} className={`${baseClasses} ${className}`} {...props} />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`${baseClasses} min-h-[80px] resize-none ${className}`}
    {...props}
  />
));
Textarea.displayName = "Textarea";
