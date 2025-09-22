import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose, isMobile = false }) => {
  const navItems = [
    { to: "/", label: "Dashboard", icon: "Home" },
    { to: "/courses", label: "Courses", icon: "BookOpen" },
    { to: "/assignments", label: "Assignments", icon: "CheckSquare" },
    { to: "/grades", label: "Grades", icon: "BarChart3" },
    { to: "/calendar", label: "Calendar", icon: "Calendar" },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">StudySync</h1>
          </div>
          
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors lg:hidden"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={isMobile ? onClose : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-100 text-primary-700 border border-primary-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )
              }
            >
              <ApperIcon name={item.icon} className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Academic Year 2024-2025
        </div>
      </div>
    </div>
  );

  // Mobile sidebar with overlay
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}

        {/* Mobile Sidebar */}
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? 0 : "-100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden"
        >
          {sidebarContent}
        </motion.aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:z-20">
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;