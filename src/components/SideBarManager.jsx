import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AiOutlineDashboard,
  AiOutlineFileText,
  AiOutlineSetting,
  AiOutlineUnorderedList,
  AiOutlineBell,
  AiOutlineQuestionCircle,
  AiOutlineLogout,
  AiOutlineAppstoreAdd,
} from "react-icons/ai";
import { FiBriefcase, FiList } from "react-icons/fi";

const SidebarManager = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // Get current path

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

  return (
    <div className={`h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <h1 className={`text-blue-800 font-bold text-xl ${collapsed ? "text-center" : ""}`}>
          {collapsed ? "AH" : "AskHire"}
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {menuItems.map((item) => (
          <NavItem key={item.label} icon={item.icon} label={item.label} path={item.path} active={location.pathname === item.path} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer Menu (Pushed to Bottom) */}
      <div className="py-4 space-y-1">
        {footerItems.map((item) => (
          <NavItem key={item.label} icon={item.icon} label={item.label} path={item.path} active={location.pathname === item.path} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, path, active, collapsed }) => {
  return (
    <Link to={path} className={`flex items-center px-4 py-2 w-full text-left transition-colors duration-150 ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>
      <div className="flex items-center">{icon}</div>
      {!collapsed && <span className="ml-3 text-sm font-medium">{label}</span>}
    </Link>
  );
};

export default SidebarManager;
