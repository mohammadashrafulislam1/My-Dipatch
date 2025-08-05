import React from 'react';
import {
  FiHelpCircle,
  FiCreditCard,
  FiMail,
  FiUser,
  FiLogOut,
  FiBell,
  FiShoppingBag,
} from 'react-icons/fi';
import BottomNavigation from '../../Components/BottomNavigation';
import { FaPencil } from 'react-icons/fa6';
import { Link } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AccountPage = () => {
  return (
    <div className="max-w-md mx-auto bg-white text-gray-900 min-h-screen relative pb-20">
        
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <div>
          <div className="text-3xl font-bold">MD ISLAM</div>
          <div className="flex items-center gap-1 mt-1 text-gray-500">
            <span className="text-sm">⭐ 4.64</span>
          </div>
        </div>
        <img
          src="https://i.pravatar.cc/100"
          alt="avatar"
          className="w-14 h-14 rounded-full border-2 border-gray-200"
        />
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-3 gap-4 px-4 py-4">
        <ActionCard icon={<FiHelpCircle size={22} />} label="Help"  path="/dashboard/support"/>
        <ActionCard icon={<FiMail size={22} />} label="Inbox"  path="/dashboard/chat"/>
        <ActionCard icon={<FiBell size={22} />} label="Notifications" badgeCount={3}  path="/dashboard/notifications"/>
      </div>

      {/* Uber Balance */}
      {/* <div className="px-4">
        <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">Uber Balance</span>
          <span className="text-xl font-semibold text-gray-900">CA$15.00</span>
        </div>
      </div> */}

      {/* Options */}
      <div className="px-4 mt-6 space-y-4">
        <OptionRow icon={<FiUser size={20} />} label="Profile"  path="/dashboard/profile"/>
        <OptionRow icon={<FiShoppingBag size={22} />} label="Orders" path="/dashboard/orders" />
        <OptionRow icon={<FiCreditCard size={22} />} label="Wallet"  path="/dashboard/wallet"/>
        <OptionRow icon={<FaPencil size={20} />} label= "New Task" path="/landingpage"/>
        <OptionRow icon={<FiLogOut size={20} />} label="Sign Out" />
      </div>


      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

const ActionCard = ({ icon, label, badgeCount, path }) => (
 <NavLink to={path}>
     <div className="relative bg-gray-100 hover:bg-gray-200 transition p-4 rounded-xl flex flex-col items-center justify-center shadow-sm">
    {badgeCount > 0 && (
      <span className="absolute top-1 right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
        {badgeCount}
      </span>
    )}
    {icon}
    <span className="mt-2 text-sm font-medium">{label}</span>
  </div>
 </NavLink>
);

const OptionRow = ({ icon, label, path }) => (
  <NavLink to={path} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">
  <div >
   
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    <i className="fas fa-chevron-right text-gray-400" />
   
  </div> </NavLink>
);

export default AccountPage;
