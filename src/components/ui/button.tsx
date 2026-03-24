import { Slot } from "@radix-ui/react-slot";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, variant = "primary", className = "", ...props }, ref) => {
    const Component = asChild ? Slot : "button";

    const variants = {
      primary:
        "flex items-center gap-1.5 rounded-md bg-tiffany px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-tiffany-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-tiffany",
      ghost:
        "rounded-md p-1.5 text-description transition-colors hover:bg-gray-100 hover:text-gray-hover cursor-pointer",
    };

    return (
      <Component
        ref={ref}
        className={`${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
