import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import CourseCard from "@/components/molecules/CourseCard";
import CourseForm from "@/components/organisms/CourseForm";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const Courses = () => {
  const { toggleMobileMenu } = useOutletContext();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = (course) => {
    setDeleteConfirm(course);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await courseService.delete(deleteConfirm.Id);
      setCourses(prev => prev.filter(c => c.Id !== deleteConfirm.Id));
      setDeleteConfirm(null);
      toast.success("Course deleted successfully");
    } catch (err) {
      toast.error("Failed to delete course");
    }
  };

  const handleSubmitCourse = async (courseData) => {
    try {
      if (editingCourse) {
        const updated = await courseService.update(editingCourse.Id, courseData);
        setCourses(prev => prev.map(c => c.Id === editingCourse.Id ? updated : c));
        toast.success("Course updated successfully");
      } else {
        const created = await courseService.create(courseData);
        setCourses(prev => [...prev, created]);
        toast.success("Course created successfully");
      }
      setIsModalOpen(false);
      setEditingCourse(null);
    } catch (err) {
      toast.error("Failed to save course");
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex-1">
        <Header title="Courses" onMenuClick={toggleMobileMenu} />
        <div className="p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  const getCourseAssignments = (courseId) => {
    return assignments.filter(a => a.courseId === courseId);
  };

  return (
    <div className="flex-1">
      <Header 
        title="Courses" 
        subtitle={`Managing ${courses.length} course${courses.length !== 1 ? 's' : ''} this semester`}
        onMenuClick={toggleMobileMenu}
        actions={
          <Button onClick={handleCreateCourse} className="inline-flex items-center gap-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Course
          </Button>
        }
      />
      
      <div className="p-6">
        {courses.length === 0 ? (
          <Empty
            icon="BookOpen"
            title="No courses yet"
            description="Start by adding your first course to track assignments and grades."
            actionText="Add Course"
            onAction={handleCreateCourse}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.Id}
                course={course}
                assignments={getCourseAssignments(course.Id)}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
              />
            ))}
          </div>
        )}
      </div>

      {/* Course Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? "Edit Course" : "Add New Course"}
        size="lg"
      >
        <CourseForm
          course={editingCourse}
          onSubmit={handleSubmitCourse}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Course"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-red-100 rounded-full p-2">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Course</h3>
              <p className="text-gray-600">This action cannot be undone.</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? 
            This will also remove all associated assignments and grades.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Courses;