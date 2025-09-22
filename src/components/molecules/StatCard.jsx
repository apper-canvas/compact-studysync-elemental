import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = "primary", 
  trend,
  description 
}) => {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-50",
    success: "text-emerald-600 bg-emerald-50",
    warning: "text-amber-600 bg-amber-50",
    error: "text-red-600 bg-red-50"
  };

  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value}
          </p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">
              {description}
            </p>
          )}
        </div>
        
        {icon && (
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <ApperIcon name={icon} className="w-6 h-6" />
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <ApperIcon 
            name={trend > 0 ? "TrendingUp" : "TrendingDown"} 
            className={`w-4 h-4 mr-1 ${trend > 0 ? "text-emerald-600" : "text-red-600"}`}
          />
          <span className={`text-sm font-medium ${trend > 0 ? "text-emerald-600" : "text-red-600"}`}>
            {Math.abs(trend)}%
          </span>
          <span className="text-gray-500 text-sm ml-1">from last semester</span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;