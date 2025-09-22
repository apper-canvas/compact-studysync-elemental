import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "BookOpen", 
  title = "Nothing here yet", 
  description = "Get started by adding your first item.",
  actionText = "Add Item",
  onAction,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="bg-gray-50 rounded-full p-6 mb-6">
        <ApperIcon name={icon} className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <Button onClick={onAction} className="inline-flex items-center gap-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default Empty;