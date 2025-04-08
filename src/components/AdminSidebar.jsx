import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AiOutlineDashboard,
  AiOutlineFileText,
  AiOutlineSetting,
  AiOutlineAppstoreAdd,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineBell,
  AiOutlineQuestionCircle,
  AiOutlineLogout
} from "react-icons/ai";
import { FiBriefcase, FiList } from "react-icons/fi";

const AdminSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { icon: <AiOutlineDashboard size={18} />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <AiOutlineFileText size={18} />, label: "Create Job Roles", path: "/admin/CreateJobs" },
    { icon: <FiList size={18} />, label: "User Roles", path: "/admin/ManageUserRoles" },
    { icon: <AiOutlineAppstoreAdd size={18} />, label: "Manage Admin", path: "/admin/ManageAdmin" },
    { icon: <FiBriefcase size={18} />, label: "Manage Manager", path: "/admin/ManageManager" },
    { icon: <AiOutlineSetting size={18} />, label: "Manage Candidate", path: "/admin/ManageCandidate" },
    { icon: <AiOutlineBell size={18} />, label: "System Notifications", path: "/admin/SystemNotification" },
  ];

  const footerItems = [

    { icon: <AiOutlineQuestionCircle size={20} />, label: "Support & Help", path: "/admin/Support" },
    { icon: <AiOutlineSetting size={20} />, label: "Settings", path: "/admin/Settings" },
    { icon: <AiOutlineLogout size={20} />, label: "Log Out", path: "/logout" }

  ];

  return (
    <>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed z-50 p-2 bg-white rounded-md shadow-md top-4 left-4 md:hidden"
      >
        <AiOutlineMenu size={20} />
      </button>

      {/* Overlay for mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"

     
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 flex flex-col bg-white border-r border-gray-200 shadow-lg md:shadow-none transition-transform duration-300 w-64
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-blue-800">
            Ask<span className="text-black">Hire</span>
          </h1>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-full md:hidden hover:bg-gray-100"
            >
              <AiOutlineClose size={20} />

            </button>
          )}
        </div>


        {/* Menu Items */}
        <nav className="flex-grow py-2 space-y-1 overflow-y-auto">

          {menuItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path}
            />
          ))}
        </nav>


        {/* Footer Menu Items */}
        <div className="py-2 mt-auto space-y-1 border-t border-gray-200">

          {footerItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const NavItem = ({ icon, label, path, active }) => {
  return (
    <Link
      to={path}

      className={`flex items-center px-4 py-3 w-full text-left transition-colors duration-150 rounded-md ${
        active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className="ml-3 text-sm font-medium">{label}</span>

    </Link>
  );
};

export default AdminSidebar;