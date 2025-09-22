import React, { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { format, isAfter, isBefore, addDays } from "date-fns";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import AssignmentItem from "@/components/molecules/AssignmentItem";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { toggleMobileMenu } = useOutletContext();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (assignment) => {
    try {
      const updatedAssignment = await assignmentService.toggleComplete(assignment.Id);
      setAssignments(prev => 
        prev.map(a => a.Id === assignment.Id ? updatedAssignment : a)
      );
      toast.success(
        updatedAssignment.completed 
          ? "Assignment marked as complete!" 
          : "Assignment marked as incomplete"
      );
    } catch (err) {
      toast.error("Failed to update assignment");
    }
  };

  const calculateGPA = () => {
    const completedAssignments = assignments.filter(a => a.completed && a.grade !== null);
    if (completedAssignments.length === 0) return 0;

    const totalPoints = completedAssignments.reduce((sum, a) => sum + a.totalPoints, 0);
    const earnedPoints = completedAssignments.reduce((sum, a) => sum + a.grade, 0);
    const percentage = (earnedPoints / totalPoints) * 100;

    // Convert to 4.0 scale
    if (percentage >= 97) return 4.0;
    if (percentage >= 93) return 3.7;
    if (percentage >= 90) return 3.3;
    if (percentage >= 87) return 3.0;
    if (percentage >= 83) return 2.7;
    if (percentage >= 80) return 2.3;
    if (percentage >= 77) return 2.0;
    if (percentage >= 73) return 1.7;
    if (percentage >= 70) return 1.3;
    if (percentage >= 67) return 1.0;
    return 0.0;
  };

  const getUpcomingAssignments = () => {
    const now = new Date();
    const upcoming = assignments
      .filter(a => !a.completed && isAfter(new Date(a.dueDate), now))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
    return upcoming;
  };

  const getOverdueAssignments = () => {
    const now = new Date();
    return assignments.filter(a => !a.completed && isBefore(new Date(a.dueDate), now));
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex-1">
        <Header title="Dashboard" onMenuClick={toggleMobileMenu} />
        <div className="p-6">
          <Error message={error} onRetry={loadDashboardData} />
        </div>
      </div>
    );
  }

  const currentGPA = calculateGPA();
  const upcomingAssignments = getUpcomingAssignments();
  const overdueAssignments = getOverdueAssignments();
  const completedAssignments = assignments.filter(a => a.completed).length;
  const totalAssignments = assignments.length;

  return (
    <div className="flex-1">
      <Header 
        title="Dashboard" 
        subtitle="Welcome back! Here's your academic overview."
        onMenuClick={toggleMobileMenu}
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Current GPA"
            value={currentGPA.toFixed(2)}
            icon="Award"
            color="primary"
          />
          
          <StatCard
            title="Active Courses"
            value={courses.length}
            icon="BookOpen"
            color="success"
          />
          
          <StatCard
            title="Assignments"
            value={`${completedAssignments}/${totalAssignments}`}
            icon="CheckSquare"
            color="warning"
            description="Completed"
          />
          
          <StatCard
            title="Overdue"
            value={overdueAssignments.length}
            icon="AlertCircle"
            color={overdueAssignments.length > 0 ? "error" : "success"}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Assignments */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h2>
                <Link to="/assignments">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              
              {upcomingAssignments.length === 0 ? (
                <Empty
                  icon="CheckSquare"
                  title="No upcoming assignments"
                  description="Great job! You're all caught up with your assignments."
                  actionText="Add Assignment"
                  onAction={() => {}}
                />
              ) : (
                <div className="space-y-4">
                  {upcomingAssignments.map((assignment) => {
                    const course = courses.find(c => c.Id === assignment.courseId);
                    return (
                      <AssignmentItem
                        key={assignment.Id}
                        assignment={assignment}
                        course={course}
                        onToggleComplete={handleToggleComplete}
                      />
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/courses">
                  <Button variant="outline" className="w-full justify-start">
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Add Course
                  </Button>
                </Link>
                <Link to="/assignments">
                  <Button variant="outline" className="w-full justify-start">
                    <ApperIcon name="PlusCircle" className="w-4 h-4 mr-2" />
                    Add Assignment
                  </Button>
                </Link>
                <Link to="/grades">
                  <Button variant="outline" className="w-full justify-start">
                    <ApperIcon name="BarChart3" className="w-4 h-4 mr-2" />
                    View Grades
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Course Overview */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Overview</h3>
              {courses.length === 0 ? (
                <p className="text-gray-500 text-sm">No courses added yet</p>
              ) : (
                <div className="space-y-3">
                  {courses.slice(0, 5).map((course) => {
                    const courseAssignments = assignments.filter(a => a.courseId === course.Id);
                    const completed = courseAssignments.filter(a => a.completed).length;
                    
                    return (
                      <div key={course.Id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: course.color }}
                          />
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {course.name}
                          </span>
                        </div>
                        <Badge variant="default" size="sm">
                          {completed}/{courseAssignments.length}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Overdue Alert */}
            {overdueAssignments.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-900">Overdue Assignments</h3>
                </div>
                <p className="text-sm text-red-700 mb-3">
                  You have {overdueAssignments.length} overdue assignment{overdueAssignments.length > 1 ? 's' : ''}.
                </p>
                <Link to="/assignments?filter=overdue">
                  <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                    View Overdue
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;