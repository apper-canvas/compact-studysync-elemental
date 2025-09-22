import React from "react";
import { cn } from "@/utils/cn";

const Progress = ({ 
  value = 0, 
  max = 100, 
  className = "", 
  color = "primary",
  showValue = false,
  size = "default"
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colors = {
    primary: "bg-primary-600",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500"
  };
  
  const sizes = {
    sm: "h-1",
    default: "h-2",
    lg: "h-3"
  };
  
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("bg-gray-200 rounded-full overflow-hidden", sizes[size])}>
        <div 
          className={cn("h-full transition-all duration-300 ease-out rounded-full", colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="mt-1 text-xs text-gray-600 text-right">
          {value} / {max}
        </div>
      )}
    </div>
  );
};

export default Progress;