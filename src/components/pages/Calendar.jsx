import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday 
} from "date-fns";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const Calendar = () => {
  const { toggleMobileMenu } = useOutletContext();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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
      setError(err.message || "Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    );
  };

  const getAssignmentsForSelectedDate = () => {
    return getAssignmentsForDate(selectedDate);
  };

  const getCourse = (courseId) => {
    return courses.find(c => c.Id === courseId);
  };

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div key={dayName} className="p-2 text-center text-sm font-medium text-gray-500 border-b border-gray-200">
            {dayName}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const dayAssignments = getAssignmentsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = isSameDay(day, selectedDate);
          const isDayToday = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`min-h-[80px] p-1 border border-gray-100 text-left hover:bg-gray-50 transition-colors ${
                !isCurrentMonth ? "text-gray-300 bg-gray-50" : ""
              } ${
                isSelected ? "bg-primary-50 border-primary-300" : ""
              } ${
                isDayToday ? "bg-blue-50 border-blue-300 font-semibold" : ""
              }`}
            >
              <div className="text-sm mb-1">
                {format(day, "d")}
              </div>
              
              <div className="space-y-1">
                {dayAssignments.slice(0, 2).map((assignment, index) => {
                  const course = getCourse(assignment.courseId);
                  return (
                    <div
                      key={index}
                      className="text-xs p-1 rounded truncate"
                      style={{ 
                        backgroundColor: course ? `${course.color}20` : "#f3f4f6",
                        color: course ? course.color : "#6b7280"
                      }}
                    >
                      {assignment.title}
                    </div>
                  );
                })}
                
                {dayAssignments.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayAssignments.length - 2} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex-1">
        <Header title="Calendar" onMenuClick={toggleMobileMenu} />
        <div className="p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  const selectedDateAssignments = getAssignmentsForSelectedDate();

  return (
    <div className="flex-1">
      <Header 
        title="Academic Calendar" 
        subtitle={`${assignments.length} assignments scheduled`}
        onMenuClick={toggleMobileMenu}
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  >
                    <ApperIcon name="ChevronRight" className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              {renderCalendarGrid()}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </h3>
              
              {selectedDateAssignments.length === 0 ? (
                <p className="text-gray-500 text-sm">No assignments due</p>
              ) : (
                <div className="space-y-3">
                  {selectedDateAssignments.map((assignment) => {
                    const course = getCourse(assignment.courseId);
                    return (
                      <div key={assignment.Id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: course?.color || "#6b7280" }}
                          />
                          <span className="text-xs font-medium text-gray-600">
                            {course?.name || "Unknown Course"}
                          </span>
                        </div>
                        
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {assignment.title}
                        </h4>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant={assignment.priority} size="sm">
                            {assignment.priority}
                          </Badge>
                          
                          {assignment.completed && (
                            <Badge variant="success" size="sm">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Legend */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Course Legend</h3>
              
              {courses.length === 0 ? (
                <p className="text-gray-500 text-sm">No courses added yet</p>
              ) : (
                <div className="space-y-2">
                  {courses.map((course) => (
                    <div key={course.Id} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: course.color }}
                      />
                      <span className="text-sm text-gray-700 truncate">
                        {course.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Upcoming Assignments */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Upcoming Assignments</h3>
              
              {(() => {
                const upcoming = assignments
                  .filter(a => !a.completed && new Date(a.dueDate) > new Date())
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .slice(0, 5);

                return upcoming.length === 0 ? (
                  <p className="text-gray-500 text-sm">No upcoming assignments</p>
                ) : (
                  <div className="space-y-2">
                    {upcoming.map((assignment) => {
                      const course = getCourse(assignment.courseId);
                      return (
                        <div key={assignment.Id} className="text-sm">
                          <div className="flex items-center space-x-1 mb-1">
                            <div 
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: course?.color || "#6b7280" }}
                            />
                            <span className="font-medium text-gray-900 truncate">
                              {assignment.title}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs ml-3">
                            Due {format(new Date(assignment.dueDate), "MMM d")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;