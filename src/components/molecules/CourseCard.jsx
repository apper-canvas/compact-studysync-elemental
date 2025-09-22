import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";
import ApperIcon from "@/components/ApperIcon";

const CourseCard = ({ course, assignments = [], onEdit, onDelete }) => {
  const completedAssignments = assignments.filter(a => a.completed).length;
  const totalAssignments = assignments.length;
  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;
  
  // Calculate current grade from completed assignments
  const completedWithGrades = assignments.filter(a => a.completed && a.grade !== null);
  const currentGrade = completedWithGrades.length > 0 
    ? completedWithGrades.reduce((sum, a) => sum + ((a.grade / a.totalPoints) * 100), 0) / completedWithGrades.length
    : null;

  return (
    <Card hover className="group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
<div 
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: course.color }}
          />
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {course.name}
            </h3>
            <p className="text-sm text-gray-600">{course.instructor}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit?.(course)}
            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete?.(course)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Credits</span>
          <span className="font-medium">{course.credits}</span>
        </div>
        
        {currentGrade !== null && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Current Grade</span>
            <Badge variant={currentGrade >= 90 ? "success" : currentGrade >= 80 ? "warning" : "error"}>
              {currentGrade.toFixed(1)}%
            </Badge>
          </div>
        )}
        
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Assignments</span>
            <span className="font-medium">{completedAssignments}/{totalAssignments}</span>
          </div>
          <Progress 
            value={completedAssignments} 
            max={totalAssignments}
            color={completionRate === 100 ? "success" : completionRate >= 50 ? "warning" : "error"}
          />
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;