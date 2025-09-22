import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text", 
  className = "", 
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white";
  
  const variants = error
    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
    : "border-gray-300 focus:border-primary-500 focus:ring-primary-200";

  return (
    <input
      type={type}
      ref={ref}
      className={cn(baseStyles, variants, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;