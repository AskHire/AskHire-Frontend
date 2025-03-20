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
    { icon: <AiOutlineQuestionCircle size={18} />, label: "Support & Help", path: "/admin/Support" },
    { icon: <AiOutlineSetting size={18} />, label: "Settings", path: "/admin/Settings" },
    { icon: <AiOutlineLogout size={18} />, label: "Log Out", path: "/logout" }
  ];

  return (
    <>
      {!mobileOpen && (
        <div className="md:hidden top-4 left-4 z-50">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-full bg-white shadow-md"
          >
            <AiOutlineMenu size={16} />
          </button>
        </div>
      )}

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed md:static h-screen z-40 flex flex-col bg-white border-r border-gray-200 shadow-lg md:shadow-none transition-all duration-300 w-56
        ${mobileOpen ? "translate-x-0" : "md:translate-x-0 -translate-x-full"}`}
      >
        <div className="p-3 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-blue-800 font-bold text-lg">Ask<span className="text-black">Hire</span></h1>

          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
            >
              <AiOutlineClose size={16} />
            </button>
          )}
        </div>

        <nav className="overflow-y-auto py-2 space-y-0.5 flex-grow">
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

        <div className="py-2 space-y-0.5 mt-auto border-t border-gray-200">
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
      className={`flex items-center px-3 py-2 w-full text-left transition-colors duration-150 ${
        active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <span className="ml-2 text-xs font-medium whitespace-nowrap">{label}</span>
    </Link>
  );
};

export default AdminSidebar;