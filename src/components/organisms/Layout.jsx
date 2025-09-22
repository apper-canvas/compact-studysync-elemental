import React, { useState, useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "@/components/organisms/Sidebar";
import { AuthContext } from "@/App";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isInitialized } = useContext(AuthContext);
  const { isAuthenticated } = useSelector((state) => state.user);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  // Show loading until authentication is initialized
  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-screen w-full">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar isOpen={false} onClose={closeMobileMenu} isMobile={false} />

      {/* Mobile Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={closeMobileMenu} isMobile={true} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-80">
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ toggleMobileMenu }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;