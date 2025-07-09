import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import AdminSidebar from "../components/Admin/AdminSidebar";


const Admin = () => {
  return (

    <div className="flex flex-col min-h-screen bg-blue-50">
      {/* Sidebar and Content Wrapper */}

      <div className="flex flex-1">
        {/* Sidebar will be rendered by the customized SidebarManager */}
        <AdminSidebar/>
        
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

export default Admin;
