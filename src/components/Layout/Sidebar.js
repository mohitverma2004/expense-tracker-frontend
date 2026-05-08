import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiDollarSign, FiPieChart, FiTarget, FiBarChart2 
} from 'react-icons/fi';

// Removed: FiSettings, FiLogOut (now in profile dropdown only)
// Removed: CSIR-CSIO text

const menuItems = [
  { path: '/', name: 'Dashboard', icon: FiHome },
  { path: '/expenses', name: 'Expenses', icon: FiDollarSign },
  { path: '/reports', name: 'Reports', icon: FiPieChart },
  { path: '/budget', name: 'Budget', icon: FiTarget },
  { path: '/analytics', name: 'Analytics', icon: FiBarChart2 },
  // Settings and Logout removed from sidebar - now in profile dropdown
];

function Sidebar({ onLogout, isMobile, setIsOpen }) {
  const handleLinkClick = () => {
    if (isMobile && setIsOpen) {
      setTimeout(() => setIsOpen(false), 150);
    }
  };

  return (
    <div className="h-full w-72 bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 shadow-xl overflow-y-auto">
      {/* Logo Section - Removed CSIO reference */}
      <div className="p-6 border-b border-indigo-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-400/30">
            <span className="text-2xl">💰</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-bold tracking-tight">FinancePro</h1>
            <p className="text-indigo-300 text-xs">Smart Expense Tracker</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Only main pages */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200 active:bg-indigo-500/30 touch-manipulation ${
                isActive 
                  ? 'bg-indigo-500/20 text-white border-l-4 border-indigo-400' 
                  : 'text-indigo-200 hover:bg-indigo-500/10 hover:text-white'
              }`
            }
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <item.icon size={22} />
            <span className="text-base font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer - No logout button here anymore */}
      <div className="p-4 border-t border-indigo-700/50">
        <div className="text-center">
          <p className="text-indigo-400/50 text-xs">© 2026 FinancePro</p>
          <p className="text-indigo-400/30 text-[10px] mt-1">Secure Expense Tracker</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;