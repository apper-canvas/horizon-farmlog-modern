import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: 'LayoutDashboard'
    },
    {
      name: 'Farms',
      href: '/farms',
      icon: 'MapPin'
    },
    {
      name: 'Crops',
      href: '/crops',
      icon: 'Sprout'
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: 'CheckSquare'
    },
    {
      name: 'Expenses',
      href: '/expenses',
      icon: 'DollarSign'
    },
    {
      name: 'Weather',
      href: '/weather',
      icon: 'Cloud'
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
          transition: { type: 'spring', damping: 25, stiffness: 200 }
        }}
        className="fixed left-0 top-0 bottom-0 w-70 bg-white border-r border-gray-200 z-50 lg:relative lg:translate-x-0 lg:z-auto"
        style={{ width: '280px' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 px-6 py-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Sprout" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-gray-900 high-contrast">
                FarmLog Pro
              </h1>
              <p className="text-xs text-gray-600">Agriculture Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) => `
                        flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 btn-touch high-contrast
                        ${isActive
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                        }
                      `}
                      onClick={() => {
                        // Close mobile sidebar when item is clicked
                        if (window.innerWidth < 1024) {
                          onToggle();
                        }
                      }}
                    >
                      <ApperIcon 
                        name={item.icon} 
                        size={20} 
                        className={isActive ? 'text-white' : 'text-gray-500'}
                      />
                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Last sync: Just now
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;