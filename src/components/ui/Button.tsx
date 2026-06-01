import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-rock-900 text-warm-white hover:bg-rock-800",
      secondary: "bg-pine-800 text-warm-white hover:bg-pine-700",
      outline: "border border-rock-900/30 text-rock-900 hover:bg-rock-900/5",
      ghost: "text-rock-900 hover:bg-rock-900/5",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-none font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warm-white disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
