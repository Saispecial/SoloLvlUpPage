import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  isLoading?: boolean;
}

export function NeonButton({ 
  children, 
  variant = "primary", 
  className, 
  isLoading,
  disabled,
  ...props 
}: NeonButtonProps) {
  const isPrimary = variant === "primary";
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={disabled || isLoading}
      className={cn(
        "relative px-8 py-3 rounded-none font-display font-bold text-lg tracking-widest uppercase overflow-hidden group transition-all duration-300",
        "border-2",
        isPrimary 
          ? "border-primary text-primary hover:bg-primary hover:text-black shadow-[0_0_15px_rgba(0,242,255,0.3)] hover:shadow-[0_0_30px_rgba(0,242,255,0.6)]" 
          : "border-secondary text-secondary hover:bg-secondary hover:text-white shadow-[0_0_15px_rgba(157,0,255,0.3)] hover:shadow-[0_0_30px_rgba(157,0,255,0.6)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {isLoading && (
          <div className={cn(
            "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin",
            isPrimary ? "border-black" : "border-white"
          )} />
        )}
        {children}
      </span>
      
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
    </motion.button>
  );
}
