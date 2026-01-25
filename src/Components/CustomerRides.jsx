import { useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { endPoint } from "./ForAPIs";
import useAuth from "./useAuth";

const CustomerRides = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Load Google Maps API only once
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // ✅ Status color map
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-gray-100 text-gray-600";
      case "accepted":
        return "bg-blue-100 text-blue-600";
      case "on_the_way":
        return "bg-indigo-100 text-indigo-600";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700";
      case "at_stop":
        return "bg-orange-100 text-orange-600";
      case "completed":
        return "bg-green-100 text-green-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  useEffect(() => {
    const fetchUserRides = async () => {
      if (!user?._id) return; // wait for user to load
      try {
        const response = await fetch(`${endPoint}/rides`);
        const data = await response.json();

        // ✅ filter rides by customerId
        const userRides = data?.rides?.filter(
          (ride) => ride.customerId === user._id
        );
        setRides(userRides || []);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchUserRides();
  }, [user]);

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>It's Loading...</p>;

  // ✅ Show only first 3 if showAll = false
  const visibleRides = showAll ? rides : rides.slice(0, 3);

  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Order History</h2>

      {visibleRides.length === 0 ? (
        <p className="text-gray-500">No rides found yet.</p>
      ) : (
        visibleRides.map((ride, index) => (
          <div
            key={ride._id || index}
            className="bg-gray-50 border rounded-xl p-4 flex items-center justify-between mb-3 transition hover:shadow"
          >
            <div>
              <p className="font-medium text-gray-800">
                {ride.customerName || "Customer"}
              </p>
              <p className="text-sm text-gray-500">
                {ride.pickup?.address || "Pickup not available"}
              </p>
              <p className="text-xs text-gray-400">
                → {ride.dropoff?.address || "Dropoff not available"}
              </p>
            </div>

            {/* ✅ Dynamic status color */}
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${getStatusColor(
                ride.status
              )}`}
            >
              {ride.status || "Pending"}
            </span>
          </div>
        ))
      )}

      {rides.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 hover:underline text-sm mt-2"
        >
          {showAll ? "See Less" : "See More"}
        </button>
      )}
    </div>
  );
};

export default CustomerRides;
