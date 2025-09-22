import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const assignmentService = {
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "total_points_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('assignment_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to UI format
      const assignments = (response.data || []).map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || '',
        description: assignment.description_c || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        dueDate: assignment.due_date_c || '',
        priority: assignment.priority_c || 'medium',
        completed: assignment.completed_c || false,
        grade: assignment.grade_c,
        totalPoints: assignment.total_points_c || 0
      }));

      return assignments;
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "total_points_c"}}
        ]
      };

      const response = await apperClient.getRecordById('assignment_c', id, params);

      if (!response?.data) {
        throw new Error("Assignment not found");
      }

      // Transform database fields to UI format
      const assignment = {
        Id: response.data.Id,
        title: response.data.title_c || '',
        description: response.data.description_c || '',
        courseId: response.data.course_id_c?.Id || response.data.course_id_c,
        dueDate: response.data.due_date_c || '',
        priority: response.data.priority_c || 'medium',
        completed: response.data.completed_c || false,
        grade: response.data.grade_c,
        totalPoints: response.data.total_points_c || 0
      };

      return assignment;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByCourseId(courseId) {
    try {
      const assignments = await this.getAll();
      return assignments.filter(a => a.courseId === parseInt(courseId));
    } catch (error) {
      console.error("Error fetching assignments by course:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI format to database fields (only Updateable fields)
      const params = {
        records: [{
          title_c: assignmentData.title,
          description_c: assignmentData.description,
          course_id_c: parseInt(assignmentData.courseId),
          due_date_c: assignmentData.dueDate,
          priority_c: assignmentData.priority,
          completed_c: assignmentData.completed || false,
          grade_c: assignmentData.grade ? parseFloat(assignmentData.grade) : null,
          total_points_c: parseFloat(assignmentData.totalPoints)
        }]
      };

      const response = await apperClient.createRecord('assignment_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
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
            title: created.title_c || '',
            description: created.description_c || '',
            courseId: created.course_id_c?.Id || created.course_id_c,
            dueDate: created.due_date_c || '',
            priority: created.priority_c || 'medium',
            completed: created.completed_c || false,
            grade: created.grade_c,
            totalPoints: created.total_points_c || 0
          };
        }
      }

      throw new Error("Failed to create assignment");
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, assignmentData) {
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
          title_c: assignmentData.title,
          description_c: assignmentData.description,
          course_id_c: parseInt(assignmentData.courseId),
          due_date_c: assignmentData.dueDate,
          priority_c: assignmentData.priority,
          completed_c: assignmentData.completed || false,
          grade_c: assignmentData.grade ? parseFloat(assignmentData.grade) : null,
          total_points_c: parseFloat(assignmentData.totalPoints)
        }]
      };

      const response = await apperClient.updateRecord('assignment_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
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
            title: updated.title_c || '',
            description: updated.description_c || '',
            courseId: updated.course_id_c?.Id || updated.course_id_c,
            dueDate: updated.due_date_c || '',
            priority: updated.priority_c || 'medium',
            completed: updated.completed_c || false,
            grade: updated.grade_c,
            totalPoints: updated.total_points_c || 0
          };
        }
      }

      throw new Error("Failed to update assignment");
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('assignment_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
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
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async toggleComplete(id) {
    try {
      // First get the current assignment
      const assignment = await this.getById(id);
      
      // Update with toggled completion status
      const updatedData = {
        ...assignment,
        completed: !assignment.completed,
        // Clear grade if uncompleting
        grade: !assignment.completed ? assignment.grade : null
      };

      return await this.update(id, updatedData);
    } catch (error) {
      console.error("Error toggling assignment completion:", error?.response?.data?.message || error);
      throw error;
}
  }
};