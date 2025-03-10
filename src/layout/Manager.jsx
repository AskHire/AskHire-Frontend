import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import SidebarManager from "../components/SideBarManager";

const Manager = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sidebar and Content Wrapper */}
      <div className="flex flex-1">
        {/* Sidebar (Not Fixed) */}
        <div className="w-64 bg-white border-r border-gray-300">
          <SidebarManager />
        </div>

        {/* Main Content */}
          <Outlet />
        </div>
      {/* Footer Below Sidebar */}
      <Footer />
    </div>
  );
};

export default Manager;
