import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const Grades = () => {
  const { toggleMobileMenu } = useOutletContext();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

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
      setError(err.message || "Failed to load grades");
    } finally {
      setLoading(false);
    }
  };

  const calculateCourseGrade = (courseId) => {
    const courseAssignments = assignments.filter(a => 
      a.courseId === courseId && a.completed && a.grade !== null
    );
    
    if (courseAssignments.length === 0) return null;

    const totalPoints = courseAssignments.reduce((sum, a) => sum + a.totalPoints, 0);
    const earnedPoints = courseAssignments.reduce((sum, a) => sum + a.grade, 0);
    
    return (earnedPoints / totalPoints) * 100;
  };

  const calculateOverallGPA = () => {
    const courseGrades = courses
      .map(course => calculateCourseGrade(course.Id))
      .filter(grade => grade !== null);
    
    if (courseGrades.length === 0) return 0;

    const averagePercentage = courseGrades.reduce((sum, grade) => sum + grade, 0) / courseGrades.length;
    
    // Convert to 4.0 scale
    if (averagePercentage >= 97) return 4.0;
    if (averagePercentage >= 93) return 3.7;
    if (averagePercentage >= 90) return 3.3;
    if (averagePercentage >= 87) return 3.0;
    if (averagePercentage >= 83) return 2.7;
    if (averagePercentage >= 80) return 2.3;
    if (averagePercentage >= 77) return 2.0;
    if (averagePercentage >= 73) return 1.7;
    if (averagePercentage >= 70) return 1.3;
    if (averagePercentage >= 67) return 1.0;
    return 0.0;
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 60) return "D";
    return "F";
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "warning";
    if (percentage >= 70) return "default";
    return "error";
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex-1">
        <Header title="Grades" onMenuClick={toggleMobileMenu} />
        <div className="p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  const overallGPA = calculateOverallGPA();
  const filteredCourses = selectedCourse === "all" 
    ? courses 
    : courses.filter(c => c.Id === parseInt(selectedCourse));

  const gradedAssignments = assignments.filter(a => a.completed && a.grade !== null);

  if (gradedAssignments.length === 0) {
    return (
      <div className="flex-1">
        <Header title="Grades" onMenuClick={toggleMobileMenu} />
        <div className="p-6">
          <Empty
            icon="BarChart3"
            title="No grades yet"
            description="Complete some assignments to see your grades and GPA calculations here."
            actionText="View Assignments"
            onAction={() => {}}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header 
        title="Grades" 
        subtitle={`Current GPA: ${overallGPA.toFixed(2)} | ${gradedAssignments.length} graded assignments`}
        onMenuClick={toggleMobileMenu}
      />
      
      <div className="p-6 space-y-6">
        {/* GPA Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {overallGPA.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">Overall GPA</p>
              <p className="text-xs text-gray-500 mt-1">4.0 Scale</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {courses.filter(c => calculateCourseGrade(c.Id) !== null).length}
              </div>
              <p className="text-sm text-gray-600">Courses with Grades</p>
              <p className="text-xs text-gray-500 mt-1">out of {courses.length}</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {gradedAssignments.length}
              </div>
              <p className="text-sm text-gray-600">Completed Assignments</p>
              <p className="text-xs text-gray-500 mt-1">with grades</p>
            </div>
          </Card>
        </div>

        {/* Course Filter */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Course Breakdown</h2>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 bg-white"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.Id} value={course.Id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Course Grades */}
        <div className="space-y-6">
          {filteredCourses.map((course) => {
            const courseGrade = calculateCourseGrade(course.Id);
            const courseAssignments = assignments.filter(a => a.courseId === course.Id);
            const gradedCourseAssignments = courseAssignments.filter(a => a.completed && a.grade !== null);
            
            return (
              <Card key={course.Id}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: course.color }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-600">{course.instructor} • {course.credits} credits</p>
                    </div>
                  </div>
                  
                  {courseGrade !== null && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {getLetterGrade(courseGrade)}
                      </div>
                      <Badge variant={getGradeColor(courseGrade)}>
                        {courseGrade.toFixed(1)}%
                      </Badge>
                    </div>
                  )}
                </div>
                
                {courseGrade !== null && (
                  <div className="mb-6">
                    <Progress 
                      value={courseGrade} 
                      max={100}
                      color={courseGrade >= 90 ? "success" : courseGrade >= 80 ? "warning" : "error"}
                      showValue
                    />
                  </div>
                )}

                {gradedCourseAssignments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No graded assignments yet</p>
                ) : (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Assignment Breakdown</h4>
                    {gradedCourseAssignments.map((assignment) => (
                      <div key={assignment.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{assignment.title}</h5>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                            <Badge variant={assignment.priority} size="sm">
                              {assignment.priority}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {assignment.grade}/{assignment.totalPoints}
                          </div>
                          <Badge variant={getGradeColor((assignment.grade / assignment.totalPoints) * 100)} size="sm">
                            {((assignment.grade / assignment.totalPoints) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Grades;