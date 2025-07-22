import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AiOutlineDashboard,
  AiOutlineFileText,
  AiOutlineSetting,
  AiOutlineEdit,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineBell,
  AiOutlineQuestionCircle,
  AiOutlineLogout,
  AiOutlineUnorderedList,
  AiOutlineUserAdd,
  AiOutlineFileDone
} from "react-icons/ai";
import { FiBriefcase, FiUsers } from "react-icons/fi";
import { MdOutlineQuiz, MdManageSearch } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const SidebarManager = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { icon: <AiOutlineDashboard size={18} />, label: "Dashboard", path: "/manager/dashboard" },
    { icon: <MdOutlineQuiz size={18} />, label: "Create Questions", path: "/manager/CreateQuestions" },
    { icon: <MdManageSearch size={18} />, label: "Manage Questions", path: "/manager/ManageQuestions" },
    { icon: <AiOutlineUserAdd size={18} />, label: "Setup Vacancy", path: "/manager/SetupVacancy" },
    { icon: <FiBriefcase size={18} />, label: "Manage Vacancy", path: "/manager/ManageVacancy" },
    { icon: <AiOutlineUnorderedList size={18} />, label: "Long-List", path: "/manager/LongList" },
    { icon: <AiOutlineBell size={18} />, label: "Notify Candidates", path: "/manager/NotifyCandidates" },
    { icon: <AiOutlineFileDone size={18} />, label: "Application", path: "/manager/ManagerApplication" },
  ];

  const footerItems = [
    { icon: <AiOutlineQuestionCircle size={18} />, label: "Support & Help", path: "/manager/Support" },
    { icon: <AiOutlineSetting size={18} />, label: "Settings", path: "/manager/Settings", hasBorder: false },
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
        className={`fixed md:static z-40 flex flex-col bg-white border-r border-gray-200 shadow-lg md:shadow-none transition-all duration-300 w-56
        ${mobileOpen ? "translate-x-0" : "md:translate-x-0 -translate-x-full"}`}
      >
        <div className="p-3 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-blue-800 font-bold text-lg">Ask<span className="text-black">Hire</span></h1>
          </div>

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
              hasBorder={item.hasBorder}
            />
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 w-full text-left transition-colors duration-150 text-gray-700 hover:bg-gray-100 border-t border-gray-200"
          >
            <div className="flex items-center justify-center">
              <AiOutlineLogout size={18} />
            </div>
            <span className="ml-2 text-sm font-medium whitespace-nowrap">Log Out</span>
          </button>
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
      <span className="ml-2 text-sm font-medium whitespace-nowrap">{label}</span>
    </Link>
  );
};

export default SidebarManager;