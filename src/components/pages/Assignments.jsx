import React, { useState, useEffect } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { isAfter, isBefore, addDays } from "date-fns";
import Header from "@/components/organisms/Header";
import AssignmentItem from "@/components/molecules/AssignmentItem";
import AssignmentForm from "@/components/organisms/AssignmentForm";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const Assignments = () => {
  const { toggleMobileMenu } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    status: searchParams.get("filter") || "all",
    course: "all",
    priority: "all"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDeleteAssignment = (assignment) => {
    setDeleteConfirm(assignment);
  };

  const handleToggleComplete = async (assignment) => {
    try {
      const updated = await assignmentService.toggleComplete(assignment.Id);
      setAssignments(prev => prev.map(a => a.Id === assignment.Id ? updated : a));
      toast.success(
        updated.completed 
          ? "Assignment marked as complete!" 
          : "Assignment marked as incomplete"
      );
    } catch (err) {
      toast.error("Failed to update assignment");
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await assignmentService.delete(deleteConfirm.Id);
      setAssignments(prev => prev.filter(a => a.Id !== deleteConfirm.Id));
      setDeleteConfirm(null);
      toast.success("Assignment deleted successfully");
    } catch (err) {
      toast.error("Failed to delete assignment");
    }
  };

  const handleSubmitAssignment = async (assignmentData) => {
    try {
      if (editingAssignment) {
        const updated = await assignmentService.update(editingAssignment.Id, assignmentData);
        setAssignments(prev => prev.map(a => a.Id === editingAssignment.Id ? updated : a));
        toast.success("Assignment updated successfully");
      } else {
        const created = await assignmentService.create(assignmentData);
        setAssignments(prev => [...prev, created]);
        toast.success("Assignment created successfully");
      }
      setIsModalOpen(false);
      setEditingAssignment(null);
    } catch (err) {
      toast.error("Failed to save assignment");
    }
  };

  const getFilteredAssignments = () => {
    const now = new Date();
    
    return assignments.filter(assignment => {
      // Status filter
      if (filters.status !== "all") {
        {
          const dueDate = new Date(assignment.dueDate);
          const isOverdue = isBefore(dueDate, now) && !assignment.completed;
          const isDueSoon = isAfter(dueDate, now) && isBefore(dueDate, addDays(now, 3)) && !assignment.completed;
          
          switch (filters.status) {
            case "completed":
              if (!assignment.completed) return false;
              break;
            case "pending":
              if (assignment.completed) return false;
              break;
            case "overdue":
              if (!isOverdue) return false;
              break;
            case "due-soon":
              if (!isDueSoon) return false;
              break;
          }
        }
      }

      // Course filter
      if (filters.course !== "all" && assignment.courseId !== parseInt(filters.course)) {
        return false;
      }

      // Priority filter
      if (filters.priority !== "all" && assignment.priority !== filters.priority) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort by due date, then by priority
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }
      
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    
    // Update URL params for status filter
    if (filterType === "status") {
      const newParams = new URLSearchParams(searchParams);
      if (value === "all") {
        newParams.delete("filter");
      } else {
        newParams.set("filter", value);
      }
      setSearchParams(newParams);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex-1">
        <Header title="Assignments" onMenuClick={toggleMobileMenu} />
        <div className="p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  const filteredAssignments = getFilteredAssignments();
  const getCourse = (courseId) => courses.find(c => c.Id === courseId);

  return (
    <div className="flex-1">
      <Header 
        title="Assignments" 
        subtitle={`${filteredAssignments.length} assignment${filteredAssignments.length !== 1 ? 's' : ''} found`}
        onMenuClick={toggleMobileMenu}
        actions={
          <Button onClick={handleCreateAssignment} className="inline-flex items-center gap-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Assignment
          </Button>
        }
      />
      
      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 bg-white"
              >
                <option value="all">All Assignments</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="due-soon">Due Soon</option>
              </select>
            </div>

            {/* Course Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                value={filters.course}
                onChange={(e) => handleFilterChange("course", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 bg-white"
              >
                <option value="all">All Courses</option>
                {courses.map((course) => (
                  <option key={course.Id} value={course.Id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        {filteredAssignments.length === 0 ? (
          assignments.length === 0 ? (
            <Empty
              icon="CheckSquare"
              title="No assignments yet"
              description="Start by adding your first assignment to stay organized."
              actionText="Add Assignment"
              onAction={handleCreateAssignment}
            />
          ) : (
            <Empty
              icon="Filter"
              title="No assignments match your filters"
              description="Try adjusting your filters to see more assignments."
              actionText="Clear Filters"
              onAction={() => setFilters({ status: "all", course: "all", priority: "all" })}
            />
          )
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <AssignmentItem
                key={assignment.Id}
                assignment={assignment}
                course={getCourse(assignment.courseId)}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditAssignment}
                onDelete={handleDeleteAssignment}
              />
            ))}
          </div>
        )}
      </div>

      {/* Assignment Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAssignment ? "Edit Assignment" : "Add New Assignment"}
        size="lg"
      >
        <AssignmentForm
          assignment={editingAssignment}
          courses={courses}
          onSubmit={handleSubmitAssignment}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Assignment"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-red-100 rounded-full p-2">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Assignment</h3>
              <p className="text-gray-600">This action cannot be undone.</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <strong>{deleteConfirm?.title}</strong>?
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete Assignment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Assignments;