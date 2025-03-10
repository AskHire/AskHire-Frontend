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
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { icon: <AiOutlineDashboard size={20} />, label: "Dashboard", path: "/manager/dashboard" },
    { icon: <AiOutlineFileText size={20} />, label: "Create Questions", path: "/manager/CreateQuestions" },
    { icon: <AiOutlineAppstoreAdd size={20} />, label: "Manage Questions", path: "/manager/ManageQuestions" },
    { icon: <AiOutlineSetting size={20} />, label: "Setup Vacancy", path: "/manager/SetupVacancy" },
    { icon: <FiBriefcase size={20} />, label: "Manage Vacancy", path: "/manager/ManageVacancy" },
    { icon: <FiList size={20} />, label: "Long-List", path: "/manager/LongList" },
    { icon: <AiOutlineBell size={20} />, label: "Notify Candidates", path: "/manager/NotifyCandidates" },
  ];

  const footerItems = [
    { icon: <AiOutlineQuestionCircle size={20} />, label: "Support & Help", path: "/manager/Support" },
    { icon: <AiOutlineSetting size={20} />, label: "Settings", path: "/manager/Settings" },
    { icon: <AiOutlineLogout size={20} />, label: "Log Out", path: "/logout" },
  ];

  // Mobile toggle button
 

  return (
    <>
      
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <div 
        className={`fixed md:static h-screen z-40 flex flex-col bg-white border-r border-gray-200 shadow-lg md:shadow-none transition-all duration-300 w-64 
        ${mobileOpen ? "translate-x-0" : "md:translate-x-0 -translate-x-full"}`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-start">
          <h1 className="text-blue-800 font-bold text-xl">
            AskHire
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
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

        {/* Footer Menu (Pushed to Bottom) */}
        <div className="py-4 space-y-1 border-t border-gray-200">
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
      className={`flex items-center px-4 py-3 w-full text-left transition-colors duration-150 ${
        active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <span className="ml-3 text-sm font-medium whitespace-nowrap">{label}</span>
    </Link>
  );
};

export default SidebarManager;