import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import SidebarManager from "../components/SidebarManager";
import ManagerUpperbar from "../components/ManagerUpperbar";

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
        <div className="flex flex-col flex-1">
          {/* Upper Bar */}
          <ManagerUpperbar />

          {/* Main Dashboard Content */}
          <div className="flex-1 bg-gray-100 px-6 pb-6">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer Below Sidebar */}
      <Footer />
    </div>
  );
};

export default Manager;
