import React, { useState, useRef, useEffect } from 'react';
import useAuth from './useAuth';
import { RiMenuUnfold2Line } from "react-icons/ri";
import { FaPencil } from "react-icons/fa6";
import { BiHistory, BiLocationPlus, BiSupport, BiWalletAlt } from "react-icons/bi";
import { BsChatLeftDots } from "react-icons/bs";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { FiBell, FiSettings, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { RxAvatar } from 'react-icons/rx';

export const PageNav = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const profileRef = useRef(null);

  // 🔥 Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  const authMenuItems = [
    { path: "/", label: "New Task", icon: <FaPencil /> },
    { path: "/dashboard/orders", label: "Orders", icon: <RiMenuUnfold2Line /> },
    { path: "/dashboard/support", label: "Support", icon: <BiSupport /> },
    { path: "/dashboard/chat", label: "Chat", icon: <BsChatLeftDots /> },
    { path: "/dashboard/wallet", label: "Wallet", icon: <BiWalletAlt /> },
  ];

  const guestMenuItems = [
    { path: "/", label: "Home", icon: <RiMenuUnfold2Line /> },
    { path: "/services", label: "Services", icon: <BiSupport /> },
    { path: "/about", label: "About", icon: <RxAvatar /> },
    { path: "/locations", label: "Locations", icon: <BiLocationPlus /> },
    { path: "/blog", label: "Blog", icon: <BiWalletAlt /> },
  ];

  const menuItems = user ? authMenuItems : guestMenuItems;

  const profileMenuItems = [
    { path: "/dashboard/profile", label: "Manage Account", icon: <FaUser /> },
    { path: "/landingpage", label: "New Task", icon: <FaPencil /> },
    { path: "/dashboard/chat", label: "Chat", icon: <BsChatLeftDots /> },
    { path: "/dashboard/settings", label: "Settings", icon: <FiSettings /> }
  ];

  const topMenuItems = [
    { path: "/dashboard/support", label: "Support", icon: <BiSupport size={20} /> },
    { path: "/dashboard/wallet", label: "Wallet", icon: <BiWalletAlt size={20} /> },
    { path: "/dashboard/orders", label: "Activity", icon: <BiHistory size={20} /> }
  ];

  return (
    <div>

      {/* ================= TOP NAVIGATION ================= */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 bg-white shadow-md z-40 h-16 items-center px-12 gap-6">
        {/* Logo */}
        <img
          src="https://i.ibb.co/TxC947Cw/thumbnail-Image-2025-07-09-at-2-10-AM-removebg-preview.png"
          alt="Logo"
          className="w-24 object-contain"
        />

        {/* Menu Items */}
        <div className="flex gap-4 flex-1">
          {menuItems.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive ? "bg-[#e6f0ff] text-[#006FFF]" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              {label}
            </NavLink>
          ))}
        </div>

        {/* ================= PROFILE & DROPDOWN ================= */}
        <div className="relative" ref={profileRef}>
          {user ? (
            <>
              {/* Profile Button */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <img
                  src={
                    user?.profileImage ||
                    "https://static.vecteezy.com/system/resources/previews/036/280/650/large_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-[#006FFF]"
                />

                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">Customer</div>
                </div>

                {showProfileDropdown ? (
                  <FiChevronUp className="text-gray-500 text-lg" />
                ) : (
                  <FiChevronDown className="text-gray-500 text-lg" />
                )}
              </div>

              {/* Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-[300px] bg-white/80 backdrop-blur-xl shadow-2xl rounded-xl z-50 p-6">

                  {/* Notification Icon */}
                  <div className="flex justify-center gap-3 mb-4">
                    <div
                      onClick={() => navigate("/dashboard/notifications")}
                      className="relative flex items-center justify-center bg-[#f0f8ff] w-12 h-12 hover:bg-[#e6f0ff] transition p-2 rounded-xl cursor-pointer text-[#006FFF] text-[20px]"
                    >
                      <FiBell />
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[14px] px-[5px] rounded-full border border-white">
                        0
                      </span>
                    </div>
                  </div>

                  {/* Top Menu Cards */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {topMenuItems.map(({ path, label, icon }, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigate(path)}
                        className="text-center text-sm p-3 rounded-lg border hover:shadow-md cursor-pointer"
                      >
                        {icon}
                        <div className="mt-1">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Profile Menu */}
                  <div className="flex flex-col gap-2">
                    {profileMenuItems.map(({ path, label, icon }, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigate(path)}
                        className="flex items-center text-[17px] gap-3 text-sm text-gray-700 hover:text-black hover:border hover:shadow-md p-3 rounded-lg cursor-pointer"
                      >
                        {icon} {label}
                      </div>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="mt-4 border-t pt-3">
                    <button
                      className="flex items-center gap-2 text-sm text-red-600 hover:underline"
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      {loading ? "Signing Out..." : (<><FaSignOutAlt /> Sign Out</>)}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* ================= BOTTOM NAV (Mobile) ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-t md:hidden flex justify-between items-center h-16 z-50 border-t px-4">
        <div className="flex flex-1 justify-around">
          {menuItems.slice(0, 4).map((item) => (
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

        {/* Mobile Profile */}
        <div className="flex flex-col items-center justify-center text-xs ml-4">
          {user ? (
            <div
              className="relative flex flex-col items-center justify-center cursor-pointer"
              onClick={() => navigate("/account")}
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="w-8 h-8 rounded-full border-2 border-[#006FFF]"
              />
              <span className="mt-[2px]">Account</span>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
