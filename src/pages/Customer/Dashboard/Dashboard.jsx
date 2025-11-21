import { useState } from "react";
import {
  BiSupport,
  BiWalletAlt,
} from "react-icons/bi";
import {
  BsCashCoin,
  BsChatLeftDots,
  BsCircleFill,
} from "react-icons/bs";
import { FaChartBar, FaHome } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import {
  FiBell,
  FiMessageSquare,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import { GoTasklist } from "react-icons/go";
import {
  IoCarSportOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { MdEditDocument } from "react-icons/md";
import { RiMenuUnfold2Line, RiRoadMapLine } from "react-icons/ri";
import { SlHome } from "react-icons/sl";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { TfiAlignLeft } from "react-icons/tfi";
import { VscSignOut } from "react-icons/vsc";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "../../../Components/BottomNavigation";
import useAuth from "../../../Components/useAuth";
import NotificationComp from "../../../Components/Notifications";
import { useNotification } from "../../../Components/NotificationContext";


const messages = [
  { id: 1, name: "John Doe", online: true },
  { id: 2, name: "Jane Smith", online: false },
  { id: 3, name: "Mike Johnson", online: true },
];


const Dashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const {user, logout} = useAuth();
  const { notifications } = useNotification();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/dashboard/orders": "Order Lists",
    "/dashboard/task": "New Task",
    "/dashboard/chat": "Chat",
    "/dashboard/wallet": "Wallet",
    "/dashboard/support": "Support",
  };
  const matchedPath = Object.keys(pageTitles)
    .sort((a, b) => b.length - a.length)
    .find((path) => location.pathname.startsWith(path));

  const currentTitle = pageTitles[matchedPath] || "Dashboard";
const handleLogout = async () => {
    try {
      await logout();          // Call your existing logout function
      window.location.href = "/"; // Full page reload to landing page
    } catch (err) {
      console.error(err);
    }
  };
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <SlHome /> },
    { path: "/", label: "New Task", icon: <FaPencil /> },
    { path: "orders", label: "Order Lists", icon: <RiMenuUnfold2Line /> },
    { path: "chat", label: "Chat", icon: <BsChatLeftDots /> },
    { path: "wallet", label: "Wallet", icon: <BiWalletAlt /> },
    { path: "support", label: "Support", icon: <BiSupport /> },
  ];

  return (
    <div className="flex w-full overflow-hidden text-black dark:text-black md:pb-0 pb-12">

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="absolute top-4 left-4 z-30 p-1 rounded-md text-gray-700 hidden"
        aria-label="Open menu"
      >
        <IoMenuOutline size={24} />
      </button>
      {/* Sidebar */}
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-screen w-72 fixed bg-white shadow-[0_0_36.2px_rgba(0,0,0,0.05)] p-4 z-20 flex-col">
        <img
          src="https://i.ibb.co/TxC947Cw/thumbnail-Image-2025-07-09-at-2-10-AM-removebg-preview.png"
          alt="Logo"
          className="w-[150px] mx-auto mb-6"
        />
        <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {menuItems.map(({ path, label, icon, type }, idx) => 
  type === "divider" ? (
    <div key={`divider-${idx}`} className="divider"></div>
  ) : (
    <NavLink
      key={path}
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md transition font-medium ${
          isActive
            ? "bg-[#006eff2a] text-[#006FFF]"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
      onClick={() => setSidebarOpen(false)} // close on click
    >
      <span className="text-[16px]">{icon}</span>
      {label}
    </NavLink>
  )
)}

        </div>
        <div className="divider mt-6 mb-2"
     /> <div className=" flex items-center gap-2 text-gray-700 px-3 py-2 hover:bg-gray-100 rounded-md  cursor-pointer"
     onClick={handleLogout}>
          <VscSignOut className="text-[16px]" />
          Sign Out</div>
      </div>

   {/* Mobile Bottom Navigation */}
<BottomNavigation/>


{showNotifications && (
  <div className="absolute right-4 top-14 w-80 bg-white shadow-xl rounded-xl z-50 border border-gray-200">
    <div className="px-4 py-3 border-b">
      <h3 className="text-base font-semibold text-gray-800">Notifications</h3>
    </div>

    <NotificationComp/>

    <button
      onClick={() => {
        setShowNotifications(false);
        window.location.href = "/dashboard/notifications";
      }}
      className="block w-full text-center text-sm text-blue-600 py-3 hover:bg-gray-100 transition"
    >
      See all notifications
    </button>
  </div>
)}

{showMessages && (
  <div className="absolute right-16 top-14 w-80 bg-white shadow-xl rounded-xl z-50 overflow-hidden">
    <div className="max-h-72 overflow-y-auto">
      <ul>
        {messages.slice(0, 5).map((user) => (
          <li
            key={user.id}
            onClick={() => {
              setShowMessages(false);
              window.location.href = `/dashboard/chat?user=${user.id}`;
            }}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 
            `}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-lg font-semibold text-white">
              {user.name.charAt(0)}
              </div>
              <BsCircleFill
                className={`absolute -bottom-1 -right-1 text-xs ${
                  user.online ? "text-green-500" : "text-gray-400"
                }`}
              />
            </div>
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <div className="text-sm text-gray-500">
                  {user.online ? "Online" : "Offline"}
                </div>
              <p className="text-xs text-gray-500 truncate w-48">{user.lastMessage}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}

{showSettings && (
  <div className="absolute right-8 top-14 w-52 bg-white shadow-xl rounded-xl z-50 overflow-hidden">
    <ul className="text-sm text-gray-700">
      <li
        className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
        onClick={() => window.location.href = "/dashboard/profile"}
      >
        <FiUsers /> Profile
      </li>
      <li
        className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
        onClick={() => window.location.href = "/dashboard/settings"}
      >
        <FiSettings /> Settings
      </li>
      <li
        className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
        onClick={() => window.location.href = "/dashboard/wallet"}
      >
        <BiWalletAlt /> Wallet
      </li>
      <li
        className="flex items-center gap-2 p-3 hover:bg-gray-100 text-red-600 cursor-pointer"
        onClick={() => window.location.href = "/logout"}
      >
        <IoCloseOutline /> Sign Out
      </li>
    </ul>
  </div>
)}


      {/* Content Area */}
      <div className="flex-1 lg:ml-72 min-h-screen bg-[#FDFDFD] overflow-hidden">
        {/* Topbar */}
        <div className="absolute md:ml-6 ml-12 mr-2 fixed md:bg-[#FDFDFD] top-6 md:top-0 left-0 right-0 h-14 
        flex flex-col-reverse md:flex-row md:items-center items-end justify-between lg:px-6 md:pr-3 md:pl-14 lg:pl-0 z-10 lg:left-72">
          <h1 className="text-xl font-semibold text-gray-800 md:mt-0 mt-2">{currentTitle}</h1>
          <div className="flex items-center md:gap-4 text-gray-600">
           <div className="flex gap-4">
           <div className="bg-[#006eff2a] w-[36px] h-[36px] flex items-center justify-center rounded-lg relative"
           onClick={() => {
            setShowNotifications(!showNotifications);
            setShowMessages(false);
            setShowSettings(false);
          }} >
              <FiBell className="text-xl cursor-pointer text-[#006FFF]" />
              <div className="bg-[#006FFF] text-white poppins-light text-[10px] px-1 rounded-full absolute top-[-7px] right-[-7px] border-[#fff] border-2">
               {notifications?.length}
              </div>
            </div>
            <div className="bg-[#006eff2a] w-[36px] h-[36px] flex items-center justify-center rounded-lg relative"
            onClick={() => {
              setShowMessages(!showMessages);
              setShowNotifications(false);
              setShowSettings(false);
            }}>
              <FiMessageSquare className="text-xl cursor-pointer text-[#006FFF]" />
              <div className="bg-[#006FFF] text-white poppins-light text-[10px] px-1 rounded-full absolute top-[-7px] right-[-7px] border-[#fff] border-2">
                0
              </div>
            </div>
            <div className="bg-[#ff04002a] w-[36px] h-[36px] flex items-center justify-center rounded-lg relative"
            onClick={() => {
              setShowSettings(!showSettings);
              setShowNotifications(false);
              setShowMessages(false);
            }}>
              <FiSettings className="text-xl cursor-pointer text-[#FF0500]" />
              <div className="bg-[#FF0500] text-white poppins-light text-[10px] px-1 rounded-full absolute top-[-7px] right-[-7px] border-[#fff] border-2">
                0
              </div>
            </div>
           </div>
            <div className="divider lg:divider-horizontal mx-0 my-0 block md:hidden"></div>
            <div className="md:flex items-center gap-2 hidden">
              <span className="text-sm font-medium">John Doe</span>
              <div className="avatar avatar-online">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="avatar"
                  className="w-8 h-8 rounded-full "
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:hidden mt-3 pl-5">
              <span className="text-sm font-medium">John Doe</span>
              <div className="avatar avatar-online">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="avatar"
                  className="w-8 h-8 rounded-full "
                />
              </div>
            </div>
      
        {/* Dynamic Page Content */}
        <main className="pt-3 md:pt-14 mt-0 md:mt-2 lg:mt-0 md:px-6 px-3 pb-6 min-h-screen bg-[#FDFDFD]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
