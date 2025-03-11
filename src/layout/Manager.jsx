import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import SidebarManager from "../components/SideBarManager";

const Manager = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content wrapper */}
      <div className="flex flex-1">
<<<<<<< Updated upstream
        {/* Sidebar (Not Fixed) */}
        <div className="w-64 bg-white border-r border-gray-300">
          <SidebarManager />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>

      {/* Footer Below Sidebar */}
      <Footer />
=======
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
>>>>>>> Stashed changes
    </div>
  );
};

export default Manager;