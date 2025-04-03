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

const SidebarManager = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // Get current path

  const menuItems = [
    { icon: <AiOutlineDashboard size={18} />, label: "Dashboard", path: "/manager/dashboard" },
    { icon: <AiOutlineFileText size={18} />, label: "Create Questions", path: "/manager/CreateQuestions" },
    { icon: <AiOutlineAppstoreAdd size={18} />, label: "Manage Questions", path: "/manager/ManageQuestions" },
    { icon: <AiOutlineSetting size={18} />, label: "Setup Vacancy", path: "/manager/SetupVacancy" },
    { icon: <FiBriefcase size={18} />, label: "Manage Vacancy", path: "/manager/ManageVacancy" },
    { icon: <FiList size={18} />, label: "Long-List", path: "/manager/LongList" },
    { icon: <AiOutlineBell size={18} />, label: "Notify Candidates", path: "/manager/NotifyCandidates" },
  ];

  const footerItems = [
    { icon: <AiOutlineQuestionCircle size={18} />, label: "Support & Help", path: "/manager/Support" },
    { icon: <AiOutlineSetting size={18} />, label: "Settings", path: "/manager/Settings", hasBorder: false },
    { icon: <AiOutlineLogout size={18} />, label: "Log Out", path: "/logout", hasBorder: true }
  ];

  return (
    <>
      {/* Mobile Toggle Button - Open button on left side when closed */}
      {!mobileOpen && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-full bg-white shadow-md"
          >
            <AiOutlineMenu size={16} />
          </button>
        </div>
      )}

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static h-screen z-40 flex flex-col bg-white border-r border-gray-200 shadow-lg md:shadow-none transition-all duration-300 w-56
        ${mobileOpen ? "translate-x-0" : "md:translate-x-0 -translate-x-full"}`}
      >
        {/* Logo and close button row */}
        <div className="p-3 border-b border-gray-200 flex justify-between items-center">
          <div>
            <a href="/" className="text-lg font-bold text-blue-600">
              Ask
            </a>
            <a href="/" className="text-lg font-bold text-base-600">
              Hire
            </a>
          </div>
          
          {/* Close button - on right side of sidebar when open */}
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
            >
              <AiOutlineClose size={16} />
            </button>
          )}
        </div>

        {/* Navigation Menu - smaller items, more compact */}
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

        {/* Footer Menu (Always at Bottom) - more compact */}
        <div className="py-2 space-y-0.5 mt-auto border-t border-gray-200">
          {footerItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path}
              hasBorder={item.hasBorder}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const NavItem = ({ icon, label, path, active, hasBorder }) => {
  return (
    <Link
      to={path}
      className={`flex items-center px-3 py-2 w-full text-left transition-colors duration-150 ${
        active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
      } ${hasBorder ? "border-t border-gray-200" : ""}`}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <span className="ml-2 text-xs font-medium whitespace-nowrap">{label}</span>
    </Link>
  );
};

export default SidebarManager;