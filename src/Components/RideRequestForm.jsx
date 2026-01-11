import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MapPinIcon, PlusIcon } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { endPoint } from "./ForAPIs.js";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@react-google-maps/api";
import useAuth from "./useAuth.js";
import toast, { Toaster } from "react-hot-toast";
import SquarePaymentForm from "./Payment/SquarePaymentForm.jsx";

export default function RideRequestForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pickup, setPickup] = useState({ address: "", lat: 0, lng: 0 });
  const [dropoff, setDropoff] = useState({ address: "", lat: 0, lng: 0 });
  const [midwayStops, setMidwayStops] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [price, setPrice] = useState(0);
const [pendingRide, setPendingRide] = useState(null);
const [showPayment, setShowPayment] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  // 🔥 Reset keys for remounting Autocomplete
  const [pickupKey, setPickupKey] = useState(1);
  const [dropoffKey, setDropoffKey] = useState(1);
  const [midwayKeys, setMidwayKeys] = useState([]);

  const pickupRef = useRef();
  const dropoffRef = useRef();
  const midwayRefs = useRef([]);

  const customerId = user?._id;

  const handleAddStop = () => {
    setMidwayStops([...midwayStops, { address: "", lat: 0, lng: 0 }]);
    setMidwayKeys([...midwayKeys, Date.now() + Math.random()]);
  };

  const handleRemoveStop = (index) => {
    setMidwayStops(midwayStops.filter((_, i) => i !== index));
    setMidwayKeys(midwayKeys.filter((_, i) => i !== index));
  };

  const calculatePrice = async () => {
  // Make sure pickup & dropoff are valid
  if (!pickup.lat || !pickup.lng || !dropoff.lat || !dropoff.lng) return;

  // Filter out invalid midway stops (lat/lng = 0)
  const validStops = midwayStops.filter(stop => stop.lat && stop.lng);

  try {
    const res = await axios.post(`${endPoint}/rides/calculate-fare`, {
      pickup,
      dropoff,
      midwayStops: validStops,
    });

    console.log("Fare API Response:", res.data);

    // Only update if customerFare exists
    if (res.data?.customerFare) {
      setPrice(res.data.customerFare);
    }
  } catch (err) {
    console.log("Price calc error:", err);
    // Optional: show a toast
    toast.error(err.response?.data?.message || "Price calculation failed");
  }
};

useEffect(() => {
  console.log("Pickup:", pickup, "Dropoff:", dropoff, "Midway:", midwayStops);
  calculatePrice();
}, [pickup, dropoff, midwayStops]);
  useEffect(() => {
    calculatePrice();
  }, [pickup, dropoff, midwayStops]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");

    if (!pickup.lat || !dropoff.lat) {
      toast.error("Please select valid Pickup & Dropoff.");
      return;
    }

    setShowConfirm(true);
  };

  // 🔥 Final Submit
  const confirmSubmit = async () => {
  if (!customerId) return;

  try {
    const res = await axios.post(`${endPoint}/rides/request`, {
      customerId,
      pickup,
      dropoff,
      midwayStops,
      instructions,
    });

    const createdRide = res.data.ride;

    setPendingRide(createdRide);   // ✅ real ride with _id
    setShowConfirm(false);
    setShowPayment(true);

  } catch (err) {
    toast.error("Failed to create ride");
  }
};

 const handlePickupChange = () => {
  const place = pickupRef.current.getPlace();
  if (!place?.geometry?.location) return;

  setPickup({
    address: place.formatted_address || "",
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
  });
};

const handleDropoffChange = () => {
  const place = dropoffRef.current.getPlace();
  if (!place?.geometry?.location) return;

  setDropoff({
    address: place.formatted_address || "",
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
  });
};


  const handleMidwayChange = (index) => {
    const place = midwayRefs.current[index].getPlace();
    if (!place?.geometry) return;

    const updated = [...midwayStops];
    updated[index] = {
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setMidwayStops(updated);
  };

  return (
    <>
      <form className="space-y-4 dark:text-white" onSubmit={handleSubmit}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          containerStyle={{ marginTop: "80px" }}
        />

        {price > 0 && (
          <div className="p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 text-lg font-semibold">
            Estimated Fare: ${price}
          </div>
        )}

        {/* Pickup */}
        <div className="relative">
          <MapPinIcon className="w-5 h-5 text-orange-500 absolute left-3 top-3.5" />
          <Autocomplete
            key={pickupKey}
            onLoad={(ref) => (pickupRef.current = ref)}
            onPlaceChanged={handlePickupChange}
          >
            <input
              type="text"
              placeholder="Pickup Location"
              className="w-full border dark:bg-white border-gray-300 rounded-md pl-10 p-3"
            />
          </Autocomplete>
        </div>

        {/* Dropoff */}
        <div className="relative">
          <MapPinIcon className="w-5 h-5 text-blue-600 absolute left-3 top-3.5" />
          <Autocomplete
            key={dropoffKey}
            onLoad={(ref) => (dropoffRef.current = ref)}
            onPlaceChanged={handleDropoffChange}
          >
            <input
              type="text"
              placeholder="Drop-off Location"
              className="w-full border dark:bg-white border-gray-300 rounded-md pl-10 p-3"
            />
          </Autocomplete>
        </div>

        {/* Midway stops */}
        {midwayStops.map((stop, index) => (
          <div key={index} className="flex items-center gap-2">
            <Autocomplete
              key={midwayKeys[index]}
              onLoad={(ref) => (midwayRefs.current[index] = ref)}
              onPlaceChanged={() => handleMidwayChange(index)}
              className="w-[86%]"
            >
              <input
                type="text"
                placeholder={`Midway Stop ${index + 1}`}
                className="w-full border dark:bg-white border-gray-300 rounded-md p-3"
              />
            </Autocomplete>

            <button
              type="button"
              onClick={() => handleRemoveStop(index)}
              className="text-red-500 text-xl w-[14%]"
            >
              <FaTimes />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddStop}
          className="flex items-center hover:underline text-md text-gray-500"
        >
          <PlusIcon className="w-5 h-5 mr-1 text-blue-600" />
          Add Midway Stop
        </button>

        {/* Instructions */}
        <textarea
          placeholder="Message/Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="w-full border dark:bg-white border-gray-300 rounded-md p-3"
          rows="3"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-lg font-semibold"
        >
          Get Instant Quote
        </button>
      </form>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-lg p-6 w-80 text-center shadow-xl">
            <h2 className="text-xl font-bold mb-3">Confirm Ride Request</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to request this ride for <b>${price}</b>?
            </p>

            <div className="flex justify-between gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="w-1/2 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={confirmSubmit}
                className="w-1/2 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
 {showPayment && (
  <div className="mt-10 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] overflow-y-auto">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto p-6">
      
      {/* Close Button */}
<button
  onClick={async () => {
    // If there is a pending ride, delete it before closing
    if (pendingRide?._id) {
      try {
        await axios.delete(`${endPoint}/rides/${pendingRide._id}`);
        toast.success("Ride cancelled successfully");
      } catch (err) {
        console.error("Failed to cancel ride:", err);
        toast.error("Failed to cancel ride");
      }
    }

    // Close modal and reset pending ride
    setShowPayment(false);
    setPendingRide(null);
  }}
  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-2xl font-bold"
>
  &times;
</button>


      <SquarePaymentForm
         rideId={pendingRide?._id}
        amount={price}
        driverEarning={price * 0.8}
        adminCut={price * 0.2}
        customerId={customerId}
        onCancel={() => setShowPayment(false)}
        onPaymentError={() => toast.error("Payment failed")}
        onPaymentSuccess={async () => {
          try {
            toast.success("🚗 Ride booked & paid successfully!");
            setShowPayment(false);

            // Reset form
            setPickup({ address: "", lat: 0, lng: 0 });
            setDropoff({ address: "", lat: 0, lng: 0 });
            setMidwayStops([]);
            setInstructions("");
            setPrice(0);
          } catch (err) {
            toast.error("Payment done, but ride creation failed!");
          }
        }}
      />
    </div>
  </div>
)}

    </>
  );
}
