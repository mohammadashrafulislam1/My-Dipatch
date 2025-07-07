import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { MdOutlineLocationOn } from "react-icons/md";

const Task = () => {
  const [midwayStops, setMidwayStops] = useState([""]);

  const handleAddStop = () => {
    setMidwayStops([...midwayStops, ""]);
  };

  const handleRemoveStop = (index) => {
    setMidwayStops(midwayStops.filter((_, idx) => idx !== index));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f9fafb] px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Book an Errand</h2>

        {/* Pickup Location */}
        <div className="mb-4">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md">
            <IoLocationSharp className="text-orange-500 text-xl" />
            <input
              type="text"
              placeholder="Pickup Location"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Drop-off Location */}
        <div className="mb-4">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md">
            <MdOutlineLocationOn className="text-blue-600 text-xl" />
            <input
              type="text"
              placeholder="Drop-off Location"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Midway Stops */}
        {midwayStops.map((_, idx) => (
          <div key={idx} className="mb-4 flex items-center gap-2">
            <div className="flex-1 bg-gray-100 px-4 py-2 rounded-md">
              <input
                type="text"
                placeholder={`Midway Stop ${idx + 1} (optional)`}
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
            <button
              onClick={() => handleRemoveStop(idx)}
              className="text-red-500 hover:text-red-700 p-1 rounded-full transition"
              aria-label={`Remove Midway Stop ${idx + 1}`}
            >
              <FaTimes />
            </button>
          </div>
        ))}

        {/* Add More Stops */}
        <button
          onClick={handleAddStop}
          className="flex items-center text-sm text-blue-700 font-medium mb-4 hover:underline"
        >
          <FaPlus className="text-xs mr-1" /> Add Midway Stop
        </button>

        {/* Message / Instructions */}
        <div className="mb-6">
          <textarea
            rows={3}
            placeholder="Message/Instructions"
            className="w-full bg-gray-100 rounded-md px-4 py-2 text-sm outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-md transition duration-200">
          Get Instant Quote
        </button>
      </div>
    </div>
  );
};

export default Task;
