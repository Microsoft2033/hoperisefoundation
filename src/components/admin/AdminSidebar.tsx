import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, LayoutDashboard, Users, HandHeart, Calendar, FileText, Image, MessageSquare, Mail, Settings, LogOut, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: HandHeart, label: 'Donations', path: '/admin/donations' },
    { icon: Users, label: 'Volunteers', path: '/admin/volunteers' },
    { icon: Calendar, label: 'Events', path: '/admin/events' },
    { icon: FileText, label: 'Programs', path: '/admin/programs' },
    { icon: BookOpen, label: 'Blog Posts', path: '/admin/blog' },
    { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    { icon: Mail, label: 'Newsletter', path: '/admin/newsletter' },
    { icon: Image, label: 'Gallery', path: '/admin/gallery' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 bg-gray-900 text-white flex flex-col min-h-screen transition-all duration-300 relative`}>
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-gray-900 border border-gray-700 text-gray-300 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-700 z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Logo */}
      <div className={`p-4 border-b border-gray-800 ${collapsed ? 'flex justify-center' : ''}`}>
        <Link to="/admin/dashboard" className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-bold text-white">HopeRise</span>
              <p className="text-green-400 text-xs">Admin</p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            title={collapsed ? label : ''}
            className={`flex items-center ${collapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-xl transition-all duration-200 group ${
              isActive(path)
                ? 'bg-green-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icon className={`flex-shrink-0 ${collapsed ? 'w-5 h-5' : 'w-5 h-5'}`} />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </Link>
        ))}
      </nav>

      {/* User Info */}
      <div className={`p-3 border-t border-gray-800 ${collapsed ? 'flex flex-col items-center' : ''}`}>
        {!collapsed && user && (
          <div className="bg-gray-800 rounded-xl p-3 mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.name}</p>
                <p className="text-gray-400 text-xs truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        <Link to="/" className={`flex items-center ${collapsed ? 'justify-center px-2' : 'space-x-2 px-3'} py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all text-sm mb-1`} title="View Site">
          <span className="text-base">🌐</span>
          {!collapsed && <span>View Site</span>}
        </Link>
        <button
          onClick={logout}
          className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'space-x-2 px-3'} py-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-xl transition-all text-sm`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
