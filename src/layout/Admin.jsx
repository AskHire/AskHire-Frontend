import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import AdminSidebar from "../components/AdminSidebar";


const Admin = () => {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      {/* Sidebar and Content Wrapper */}
      <div className="flex flex-1">
        {/* Sidebar (Not Fixed) */}
        <div className="w-64 bg-white border-r border-gray-300">
            <AdminSidebar/>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>

      {/* Footer Below Sidebar */}
      <Footer/>
    </div>
  );
};

export default Admin;
