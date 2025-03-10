import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  ListChecks, 
  Settings, 
  Briefcase, 
  List, 
  Bell, 
  HelpCircle, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const SidebarNavigation = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/manager/dashboard' },
    { icon: <FileText size={20} />, label: 'Create Questions', path: '/manager/CreateQuestions' },
    { icon: <ListChecks size={20} />, label: 'Manage Questions', path: '/manager/ManageQuestions' },
    { icon: <Settings size={20} />, label: 'Setup Vacancy', path: '/manager/SetupVacancy' },
    { icon: <Briefcase size={20} />, label: 'Manage Vacancy', path: '/manager/ManageVacancy' },
    { icon: <List size={20} />, label: 'Long-List', path: '/manager/LongList' },
    { icon: <Bell size={20} />, label: 'Notify Candidates', path: '/manager/NotifyCandidates' },
  ];

  const footerItems = [
    { icon: <HelpCircle size={20} />, label: 'Support & Help', path: '/support' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    { icon: <LogOut size={20} />, label: 'Log Out', path: '/logout' },
  ];

  return (
    <div className="flex h-screen">
      {/* Mobile Menu Button */}
      <button 
        className="absolute top-4 left-4 z-50 md:hidden bg-white rounded-full p-2 shadow-md border border-gray-200"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed md:relative h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 
        ${collapsed ? 'w-16' : 'w-64'} 
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:flex flex-col z-40`}
      >
        {/* Logo Area */}
        <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className={`text-blue-800 font-bold text-xl ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? "AH" : "AskHire"}
          </h1>
          {/* Collapse Toggle */}
          <button 
            className="hidden md:block bg-gray-100 p-1 rounded-full hover:bg-gray-200"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto py-4 space-y-1">
          {menuItems.map((item) => (
            <NavItem 
              key={item.label}
              icon={item.icon} 
              label={item.label} 
              path={item.path}
              collapsed={collapsed} 
              active={location.pathname === item.path}
            />
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 py-4 space-y-1">
          {footerItems.map((item) => (
            <NavItem 
              key={item.label}
              icon={item.icon} 
              label={item.label} 
              path={item.path}
              collapsed={collapsed} 
              active={location.pathname === item.path}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, path, collapsed, active }) => {
  return (
    <Link 
      to={path}
      className={`flex items-center px-4 py-2 w-full text-left transition-colors duration-150 ${
        active 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center justify-center">
        {icon}
      </div>
      {!collapsed && (
        <span className="ml-3 text-sm font-medium">{label}</span>
      )}
    </Link>
  );
};

export default SidebarNavigation;
