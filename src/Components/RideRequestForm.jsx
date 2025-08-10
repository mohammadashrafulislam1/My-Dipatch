import { useState } from "react";
import axios from "axios";
import { MapPinIcon, PlusIcon } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { endPoint } from "./ForAPIs.js";

export default function RideRequestForm() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [midwayStops, setMidwayStops] = useState([""]); // Default 1 midway stop
  const [instructions, setInstructions] = useState("");
  const [price, setPrice] = useState(0);

  // Temporary: Replace with logged-in user's ID
  const customerId = "YOUR_CUSTOMER_ID";

  const handleAddStop = () => setMidwayStops([...midwayStops, ""]);
  const handleRemoveStop = (index) => {
    setMidwayStops(midwayStops.filter((_, i) => i !== index));
  };
  const handleStopChange = (index, value) => {
    const updated = [...midwayStops];
    updated[index] = value;
    setMidwayStops(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${endPoint}/rides/request`,
        {
          customerId,
          pickup,
          dropoff,
          midwayStops,
          instructions,
          price: parseFloat(price) || 0,
        }
      );

      alert("✅ Ride requested successfully!");
      console.log("Ride Data:", res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to request ride.");
    }
  };

  return (
    <form className="space-y-4 dark:text-white" onSubmit={handleSubmit}>
      {/* Pickup Location */}
      <div className="relative">
        <MapPinIcon className="w-5 h-5 text-orange-500 absolute left-3 top-3.5" />
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="w-full dark:bg-white border border-gray-300 rounded-md pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Drop-off Location */}
      <div className="relative">
        <MapPinIcon className="w-5 h-5 text-blue-600 absolute left-3 top-3.5" />
        <input
          type="text"
          placeholder="Drop-off Location"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
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
        className="flex items-center hover:underline text-md text-gray-500 poppins-regular"
      >
        <PlusIcon className="w-5 h-5 mr-1 text-blue-600" />
        Add Midway Stop
      </button>

      {/* Message Box */}
      <textarea
        placeholder="Message/Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        className="w-full border dark:bg-white border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
      ></textarea>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-lg font-semibold"
      >
        Get Instant Quote
      </button>
    </form>
  );
}
