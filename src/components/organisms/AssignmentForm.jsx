import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";

const AssignmentForm = ({ assignment, courses = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    dueDate: "",
    priority: "medium",
    totalPoints: "",
    completed: false,
    grade: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || "",
        description: assignment.description || "",
        courseId: assignment.courseId || "",
        dueDate: assignment.dueDate ? format(new Date(assignment.dueDate), "yyyy-MM-dd") : "",
        priority: assignment.priority || "medium",
        totalPoints: assignment.totalPoints?.toString() || "",
        completed: assignment.completed || false,
        grade: assignment.grade?.toString() || ""
      });
    }
  }, [assignment]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Assignment title is required";
    }
    
    if (!formData.courseId) {
      newErrors.courseId = "Please select a course";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    
    const totalPoints = parseFloat(formData.totalPoints);
    if (!formData.totalPoints || isNaN(totalPoints) || totalPoints <= 0) {
      newErrors.totalPoints = "Total points must be a positive number";
    }
    
    if (formData.completed && formData.grade) {
      const grade = parseFloat(formData.grade);
      if (isNaN(grade) || grade < 0 || grade > totalPoints) {
        newErrors.grade = `Grade must be between 0 and ${totalPoints}`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    const assignmentData = {
      ...formData,
      totalPoints: parseFloat(formData.totalPoints),
      grade: formData.grade ? parseFloat(formData.grade) : null,
      Id: assignment?.Id || Date.now()
    };

    onSubmit(assignmentData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <FormField
        label="Assignment Title"
        required
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="e.g., Research Paper on Cognitive Psychology"
        error={errors.title}
      />

      <FormField
        label="Course"
        required
        error={errors.courseId}
      >
        <select
          value={formData.courseId}
          onChange={(e) => handleChange("courseId", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 bg-white"
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.Id} value={course.Id}>
              {course.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Assignment details and requirements..."
      >
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 resize-none bg-white"
          placeholder="Assignment details and requirements..."
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Due Date"
          type="date"
          required
          value={formData.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
          error={errors.dueDate}
        />

        <FormField
          label="Priority"
          required
          error={errors.priority}
        >
          <select
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Total Points"
          type="number"
          required
          value={formData.totalPoints}
          onChange={(e) => handleChange("totalPoints", e.target.value)}
          placeholder="100"
          min="1"
          error={errors.totalPoints}
        />

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="completed"
              checked={formData.completed}
              onChange={(e) => handleChange("completed", e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="completed" className="text-sm font-medium text-gray-700">
              Mark as completed
            </label>
          </div>

          {formData.completed && (
            <FormField
              label="Grade Received"
              type="number"
              value={formData.grade}
              onChange={(e) => handleChange("grade", e.target.value)}
              placeholder="Grade points"
              min="0"
              max={formData.totalPoints}
              error={errors.grade}
            />
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {assignment ? "Update Assignment" : "Create Assignment"}
        </Button>
      </div>
    </form>
  );
};

export default AssignmentForm;