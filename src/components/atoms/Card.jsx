import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className = "", 
  padding = "default",
  hover = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl border border-gray-200 transition-all duration-200";
  
  const paddingStyles = {
    none: "",
    sm: "p-4",
    default: "p-6",
    lg: "p-8",
  };
  
  const hoverStyles = hover 
    ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" 
    : "shadow-sm";

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        paddingStyles[padding],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;