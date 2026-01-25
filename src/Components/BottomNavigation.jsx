// src/BottomNavigation.js
import React, { useState } from 'react';
import { BiSupport } from 'react-icons/bi';
import { BsChatLeftDots } from 'react-icons/bs';
import { FaPencil } from 'react-icons/fa6';
import { FiHome } from 'react-icons/fi';
import { RiMenuUnfold2Line } from 'react-icons/ri';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState('Account');
  const { user, logout, loading } = useAuth();
  
  const navigate = useNavigate();
  const tabs = [
    { path: "/", label: "New Task", icon: <FaPencil /> },
    { path: "/dashboard/orders", label: "Orders", icon: <RiMenuUnfold2Line /> },
    { path: "/dashboard/chat", label: "Chat", icon: <BsChatLeftDots /> },
    { path: "/dashboard/support", label: "Support", icon: <BiSupport /> },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-t md:hidden flex justify-between items-center h-16 z-50 border-t px-4">
      {/* Main Navigation Items */}
      <div className="flex flex-1 justify-around">
        {tabs.slice(0, 4).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs ${
                isActive ? "text-[#006FFF]" : "text-gray-600"
              }`
            }
          >
            <span className="text-2xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
      
      {/* Avatar for Account Page */}
      <div 
        className="relative flex flex-col items-center justify-center text-xs cursor-pointer ml-4"
        onClick={() => navigate("/account")}
      >
        <img
          src={
                    user?.profileImage ||
                    "https://static.vecteezy.com/system/resources/previews/036/280/650/large_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
                  }
          alt="avatar"
          className="w-8 h-8 rounded-full border-2 border-[#006FFF]"
        />
        <span className="mt-[2px]">Account</span>
      </div>
    </div>
  );
};

export default BottomNavigation;