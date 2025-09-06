import { useState, useRef } from "react";
import axios from "axios";
import { MapPinIcon, PlusIcon } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { endPoint } from "./ForAPIs.js";
import { useNavigate } from "react-router-dom";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import useAuth from "./useAuth.js";

export default function RideRequestForm() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // State
  const [pickup, setPickup] = useState({ address: "", lat: 0, lng: 0 });
  const [dropoff, setDropoff] = useState({ address: "", lat: 0, lng: 0 });
  const [midwayStops, setMidwayStops] = useState([{ address: "", lat: 0, lng: 0 }]);
  const [instructions, setInstructions] = useState("");
  const [price, setPrice] = useState(0);

  // Refs for Autocomplete
  const pickupRef = useRef();
  const dropoffRef = useRef();
  const midwayRefs = useRef([]);

  // Dummy customer ID (replace with logged-in user ID)
  const customerId = "688aef18de763ae87a994a39";

  // Handle midway stop add/remove
  const handleAddStop = () => {
    setMidwayStops([...midwayStops, { address: "", lat: 0, lng: 0 }]);
  };
  const handleRemoveStop = (index) => {
    setMidwayStops(midwayStops.filter((_, i) => i !== index));
  };

  // On submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    // Ensure valid locations
    if (!pickup.lat || !dropoff.lat) {
      alert("❌ Please select valid Pickup and Drop-off from suggestions.");
      return;
    }

    try {
      const res = await axios.post(`${endPoint}/rides/request`, {
        customerId,
        pickup,
        dropoff,
        midwayStops,
        instructions,
        price: parseFloat(price) || 0,
      });

      alert("✅ Ride requested successfully!");
      console.log("Ride Data:", res.data);
    } catch (err) {
      console.error("Ride request error:", err.response?.data || err.message);
      alert("❌ Failed to request ride.");
    }
  };

  // Autocomplete Place Changed handlers
  const handlePickupChange = () => {
    const place = pickupRef.current.getPlace();
    if (!place.geometry) return;
    setPickup({
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };

  const handleDropoffChange = () => {
    const place = dropoffRef.current.getPlace();
    if (!place.geometry) return;
    setDropoff({
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };

  const handleMidwayChange = (index) => {
    const place = midwayRefs.current[index].getPlace();
    if (!place.geometry) return;
    const updated = [...midwayStops];
    updated[index] = {
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setMidwayStops(updated);
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <form className="space-y-4 dark:text-white" onSubmit={handleSubmit}>
        {/* Pickup Location */}
        <div className="relative">
          <MapPinIcon className="w-5 h-5 text-orange-500 absolute left-3 top-3.5" />
          <Autocomplete
            onLoad={(ref) => (pickupRef.current = ref)}
            onPlaceChanged={handlePickupChange}
          >
            <input
              type="text"
              placeholder="Pickup Location"
              defaultValue={pickup.address}
              className="w-full dark:bg-white border border-gray-300 rounded-md pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Autocomplete>
        </div>

        {/* Drop-off Location */}
        <div className="relative">
          <MapPinIcon className="w-5 h-5 text-blue-600 absolute left-3 top-3.5" />
          <Autocomplete
            onLoad={(ref) => (dropoffRef.current = ref)}
            onPlaceChanged={handleDropoffChange}
          >
            <input
              type="text"
              placeholder="Drop-off Location"
              defaultValue={dropoff.address}
              className="w-full border dark:bg-white border-gray-300 rounded-md pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Autocomplete>
        </div>

        {/* Midway Stops */}
        {midwayStops.map((stop, index) => (
          <div key={index} className="flex items-center gap-2">
            <Autocomplete
              onLoad={(ref) => (midwayRefs.current[index] = ref)}
              onPlaceChanged={() => handleMidwayChange(index)}
              className="w-full"
            
            >
              <input
                type="text"
                placeholder={`Midway Stop ${index + 1}`}
                defaultValue={stop.address}
                className="w-full border dark:bg-white border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Autocomplete>
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
    </LoadScript>
  );
}
