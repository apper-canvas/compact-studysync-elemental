import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

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