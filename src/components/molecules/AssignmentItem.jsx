import React from "react";
import { format, isAfter, isBefore, addDays } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const AssignmentItem = ({ assignment, course, onToggleComplete, onEdit, onDelete }) => {
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = isBefore(dueDate, now) && !assignment.completed;
  const isDueSoon = isAfter(dueDate, now) && isBefore(dueDate, addDays(now, 3)) && !assignment.completed;
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };
  
  const getStatusColor = () => {
    if (assignment.completed) return "success";
    if (isOverdue) return "error";
    if (isDueSoon) return "warning";
    return "default";
  };

  return (
    <Card className={`transition-all duration-200 ${assignment.completed ? "opacity-75" : ""}`}>
      <div className="flex items-start space-x-4">
        <button
          onClick={() => onToggleComplete?.(assignment)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            assignment.completed
              ? "bg-emerald-600 border-emerald-600 text-white"
              : "border-gray-300 hover:border-emerald-600"
          }`}
        >
          {assignment.completed && (
            <ApperIcon name="Check" className="w-3 h-3" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: course?.color || "#6b7280" }}
                />
                <h4 className={`font-medium ${assignment.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                  {assignment.title}
                </h4>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                {course?.name || "Unknown Course"}
              </p>
              
              {assignment.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {assignment.description}
                </p>
              )}
              
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
                  <span className={isOverdue ? "text-red-600 font-medium" : "text-gray-600"}>
                    Due {format(dueDate, "MMM d, yyyy")}
                  </span>
                </div>
                
                {assignment.totalPoints && (
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Target" className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{assignment.totalPoints} pts</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-start space-x-2 ml-4">
              <Badge variant={getPriorityColor(assignment.priority)} size="sm">
                {assignment.priority}
              </Badge>
              
              <Badge variant={getStatusColor()} size="sm">
                {assignment.completed ? "Complete" : isOverdue ? "Overdue" : isDueSoon ? "Due Soon" : "Upcoming"}
              </Badge>
              
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => onEdit?.(assignment)}
                  className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <ApperIcon name="Edit2" className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDelete?.(assignment)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {assignment.completed && assignment.grade !== null && (
            <div className="mt-3 p-2 bg-emerald-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-700">Grade Received:</span>
                <span className="font-medium text-emerald-700">
                  {assignment.grade}/{assignment.totalPoints} ({((assignment.grade / assignment.totalPoints) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AssignmentItem;