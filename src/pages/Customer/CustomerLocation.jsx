import React, { useState } from "react";
import { MdLocationOn, MdHome, MdWork, MdStar } from "react-icons/md";

function CustomerLocation() {
  const [search, setSearch] = useState("");

  const recentLocations = [
    { name: "Home", address: "123 Main Street, Regina", icon: <MdHome className="text-blue-500 w-6 h-6" /> },
    { name: "Work", address: "456 Office Blvd, Regina", icon: <MdWork className="text-green-500 w-6 h-6" /> },
    { name: "Airport", address: "Regina International Airport", icon: <MdLocationOn className="text-red-500 w-6 h-6" /> },
  ];

  const favoriteLocations = [
    { name: "Mall", address: "Regina Mall, 789 King Street", icon: <MdStar className="text-yellow-500 w-6 h-6" /> },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Select Location</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for a location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Map Placeholder */}
      <div className="w-full h-64 mb-6 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map will appear here</p>
      </div>

      {/* Recent Locations */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Recent Locations</h2>
        <ul className="space-y-3">
          {recentLocations.map((loc, index) => (
            <li
              key={index}
              className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
            >
              {loc.icon}
              <div className="ml-3">
                <p className="font-medium">{loc.name}</p>
                <p className="text-gray-500 text-sm">{loc.address}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Favorite Locations */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Favorite Locations</h2>
        <ul className="space-y-3">
          {favoriteLocations.map((loc, index) => (
            <li
              key={index}
              className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
            >
              {loc.icon}
              <div className="ml-3">
                <p className="font-medium">{loc.name}</p>
                <p className="text-gray-500 text-sm">{loc.address}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CustomerLocation;
