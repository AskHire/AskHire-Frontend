import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import SidebarManager from "../components/SideBarManager";

const Manager = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      {/* Main content wrapper */}
      <div className="flex flex-1">
        {/* Sidebar will be rendered by the customized SidebarManager */}
        <SidebarManager />
        
        {/* Main Content - taking remaining space */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
      
      {/* Responsive Footer */}
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Manager;