import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const courseService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('course_c', params);

if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      const courses = (response.data || []).map(course => ({
        Id: course.Id,
        name: course.name_c || '',
        instructor: course.instructor_c || '',
        credits: course.credits_c || 0,
        color: course.color_c || '#3b82f6',
        semester: course.semester_c || 'Fall',
        year: course.year_c || new Date().getFullYear()
      }));

      return courses;
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}}
        ]
      };

      const response = await apperClient.getRecordById('course_c', id, params);

      if (!response?.data) {
        throw new Error("Course not found");
      }

      // Transform database fields to UI format
      const course = {
        Id: response.data.Id,
        name: response.data.name_c || '',
        instructor: response.data.instructor_c || '',
        credits: response.data.credits_c || 0,
        color: response.data.color_c || '#3b82f6',
        semester: response.data.semester_c || 'Fall',
        year: response.data.year_c || new Date().getFullYear()
      };

      return course;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(courseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI format to database fields (only Updateable fields)
      const params = {
        records: [{
          name_c: courseData.name,
          instructor_c: courseData.instructor,
          credits_c: parseInt(courseData.credits),
          color_c: courseData.color,
          semester_c: courseData.semester,
          year_c: parseInt(courseData.year)
        }]
      };

      const response = await apperClient.createRecord('course_c', params);

if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          // Transform back to UI format
          return {
            Id: created.Id,
            name: created.name_c || '',
            instructor: created.instructor_c || '',
            credits: created.credits_c || 0,
            color: created.color_c || '#3b82f6',
            semester: created.semester_c || 'Fall',
            year: created.year_c || new Date().getFullYear()
          };
        }
      }

      throw new Error("Failed to create course");
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, courseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI format to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: courseData.name,
          instructor_c: courseData.instructor,
          credits_c: parseInt(courseData.credits),
          color_c: courseData.color,
          semester_c: courseData.semester,
          year_c: parseInt(courseData.year)
        }]
      };

      const response = await apperClient.updateRecord('course_c', params);
if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          // Transform back to UI format
          return {
            Id: updated.Id,
            name: updated.name_c || '',
            instructor: updated.instructor_c || '',
            credits: updated.credits_c || 0,
            color: updated.color_c || '#3b82f6',
            semester: updated.semester_c || 'Fall',
            year: updated.year_c || new Date().getFullYear()
          };
        }
      }

      throw new Error("Failed to update course");
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('course_c', params);

if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error);
      throw error;
}
  }
};