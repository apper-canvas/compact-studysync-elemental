import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const CourseForm = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    instructor: "",
    credits: "",
    color: "#3b82f6",
    semester: "Fall",
    year: new Date().getFullYear()
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (course) {
setFormData({
        name: course.name || "",
        instructor: course.instructor || "",
        credits: course.credits?.toString() || "",
        color: course.color || "#3b82f6",
        semester: course.semester || "Fall",
        year: course.year || new Date().getFullYear()
      });
    }
  }, [course]);

  const courseColors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
    "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Course name is required";
    }
    
    if (!formData.instructor.trim()) {
      newErrors.instructor = "Instructor name is required";
    }
    
    const credits = parseFloat(formData.credits);
    if (!formData.credits || isNaN(credits) || credits <= 0 || credits > 10) {
      newErrors.credits = "Credits must be a number between 1 and 10";
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

    const courseData = {
      ...formData,
      credits: parseFloat(formData.credits),
      Id: course?.Id || Date.now()
    };

    onSubmit(courseData);
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
        label="Course Name"
        required
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="e.g., Introduction to Psychology"
        error={errors.name}
      />

      <FormField
        label="Instructor"
        required
        value={formData.instructor}
        onChange={(e) => handleChange("instructor", e.target.value)}
        placeholder="e.g., Dr. Sarah Johnson"
        error={errors.instructor}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Credits"
          type="number"
          required
          value={formData.credits}
          onChange={(e) => handleChange("credits", e.target.value)}
          placeholder="3"
          min="1"
          max="10"
          step="0.5"
          error={errors.credits}
        />

        <FormField
          label="Semester"
          required
          error={errors.semester}
        >
          <select
            value={formData.semester}
            onChange={(e) => handleChange("semester", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 bg-white"
          >
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
          </select>
        </FormField>
      </div>

      <FormField
        label="Academic Year"
        type="number"
        required
        value={formData.year}
        onChange={(e) => handleChange("year", parseInt(e.target.value))}
        min="2020"
        max="2030"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Course Color
        </label>
        <div className="grid grid-cols-8 gap-2">
          {courseColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleChange("color", color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                formData.color === color
                  ? "border-gray-900 scale-110"
                  : "border-gray-300 hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
            >
              {formData.color === color && (
                <ApperIcon name="Check" className="w-4 h-4 text-white mx-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {course ? "Update Course" : "Create Course"}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;