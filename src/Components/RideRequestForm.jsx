import { useState } from "react";
import axios from "axios";
import { MapPinIcon, PlusIcon } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { endPoint } from "./ForAPIs.js";
import useAuth from "./useAuth.js";
import { useNavigate } from "react-router-dom";

export default function RideRequestForm() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

    // Initialize state
const [pickup, setPickup] = useState({ address: "", lat: 0, lng: 0 });
const [dropoff, setDropoff] = useState({ address: "", lat: 0, lng: 0 });
const [midwayStops, setMidwayStops] = useState([{ address: "", lat: 0, lng: 0 }]);
  const [instructions, setInstructions] = useState("");
  const [price, setPrice] = useState(0);

  // Temporary: Replace with logged-in user's ID
  const customerId = "688aef18de763ae87a994a39";

  
// When adding a stop, add an object, not a string
const handleAddStop = () => setMidwayStops([...midwayStops, { address: "" }]);
  const handleRemoveStop = (index) => {
    setMidwayStops(midwayStops.filter((_, i) => i !== index));
  };
  // For midwayStops change
const handleStopChange = (index, value) => {
    const updated = [...midwayStops];
    updated[index] = { address: value };  // update with object, not string
    setMidwayStops(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login"); // redirect if not logged in
      return;
    }
  
   console.log(endPoint)
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
          value={pickup.address}
          onChange={(e) => setPickup({ address: e.target.value })}
          className="w-full dark:bg-white border border-gray-300 rounded-md pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Drop-off Location */}
      <div className="relative">
        <MapPinIcon className="w-5 h-5 text-blue-600 absolute left-3 top-3.5" />
        <input
          type="text"
          placeholder="Drop-off Location"
          value={dropoff.address}
          onChange={(e) => setDropoff({ address: e.target.value })}
          className="w-full border dark:bg-white border-gray-300 rounded-md pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Midway Stops */}
      {midwayStops.map((stop, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={stop.address}
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
