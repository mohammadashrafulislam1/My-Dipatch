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
    <div className="min-h-screen mx-auto flex justify-center items-center dark:bg-white px-4 py-12">
  <div className="bg-white dark:bg-gray-100 w-full rounded-2xl shadow-md p-6 md:p-8 mx-auto md:w-[50%] !z-10">
    <h2 className="text-4xl font-bold poppins-semibold text-blue-900 mb-6">Book an Errand</h2>

    <form className="space-y-4 dark:text-black">
      {/* Pickup Location */}
      <div className="relative">
        <IoLocationSharp className="w-5 h-5 text-orange-500 absolute left-3 top-3.5" />
        <input
          type="text"
          placeholder="Pickup Location"
          className="w-full border dark:bg-white border-gray-300 rounded-md pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Drop-off Location */}
      <div className="relative">
        <MdOutlineLocationOn className="w-5 h-5 text-blue-600 absolute left-3 top-3.5" />
        <input
          type="text"
          placeholder="Drop-off Location"
          className="w-full border dark:bg-white border-gray-300 rounded-md pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Midway Stops */}
      {midwayStops.map((stop, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={stop}
            onChange={(e) => handleStopChange(index, e.target.value)}
            placeholder={`Midway Stop ${index + 1}`}
            className="w-full border dark:bg-white border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => handleRemoveStop(index)}
            className="text-red-500 hover:text-red-700 p-1 rounded-full"
            aria-label={`Remove Midway Stop ${index + 1}`}
          >
            <FaTimes />
          </button>
        </div>
      ))}

      {/* Add Midway Stop */}
      <button
        type="button"
        onClick={handleAddStop}
        className="flex items-center hover:underline text-md text-gray-500"
      >
        <FaPlus className="w-4 h-4 mr-1 text-blue-600 font-bold" />
        Add Midway Stop
      </button>

      {/* Message Box */}
      <textarea
        placeholder="Message/Instructions"
        rows="3"
        className="w-full border dark:bg-white border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-lg font-semibold transition duration-200"
      >
        Get Instant Quote
      </button>
    </form>
  </div>
</div>

  );
};

export default Task;
