import React from "react";
import { MdLocationOn } from "react-icons/md";
import { PageNav } from "../Components/PageNavigation";

function Locations() {
  // List of company operational locations
  const operationalLocations = [
    { city: "Regina", address: "123 Main Street, Regina" },
    { city: "Saskatoon", address: "456 Central Ave, Saskatoon" },
    { city: "Winnipeg", address: "789 King Street, Winnipeg" },
    { city: "Calgary", address: "101 North Road, Calgary" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
        <PageNav/>
      {/* Header */}
      <h1 className="text-2xl font-bold mt-16 mb-6 text-center">Where We Operate</h1>

      {/* Map Placeholder */}
      <div className="w-full h-64 mb-6 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map showing operational areas will appear here</p>
      </div>

      {/* Operational Locations List */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-center">Our Locations</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {operationalLocations.map((loc, index) => (
            <li
              key={index}
              className="flex items-center p-4 bg-white rounded-lg shadow hover:bg-gray-100 cursor-pointer"
            >
              <MdLocationOn className="text-red-500 w-6 h-6 mr-3" />
              <div>
                <p className="font-medium">{loc.city}</p>
                <p className="text-gray-500 text-sm">{loc.address}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Locations;
