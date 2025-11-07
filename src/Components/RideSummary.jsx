import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { endPoint } from "./ForAPIs";

const RideSummary = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      if (!user?._id) return;
      try {
        const response = await fetch(`${endPoint}/rides`);
        const data = await response.json();
        console.log(data)
        const userRides = data.rides.filter((r) => r.customerId === user._id);
        setRides(userRides);
      } catch (err) {
        console.error("Error fetching rides:", err);
      }
    };
    fetchRides();
  }, [user]);

  // ✅ Calculate ride stats
  const totalRides = rides.length;
  const completed = rides.filter((r) => r.status === "completed").length;
  const cancelled = rides.filter((r) => r.status === "cancelled").length;
  const lastRideDate =
    rides.length > 0
      ? new Date(rides[rides.length - 1].createdAt).toLocaleDateString()
      : "N/A";

// ✅ Only count completed rides' distances
const totalDistance = rides
  .filter((ride) => ride.status?.toLowerCase() === "completed") // filter completed only
  .reduce((acc, ride) => {
    if (!ride.distance) return acc;
    const match = ride.distance.match(/[\d.]+/); // extract numeric part like "6.42"
    const value = match ? parseFloat(match[0]) : 0;
    return acc + value;
  }, 0)
  .toFixed(1);



  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Your Ride Summary</h2>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-blue-50 rounded-xl p-4 shadow-sm hover:bg-blue-100 transition">
          <p className="text-sm text-gray-500">Total Rides</p>
          <p className="text-2xl font-bold text-blue-600">{totalRides}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow-sm hover:bg-green-100 transition">
          <p className="text-sm text-gray-500">Total Distance Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {totalDistance} km
          </p>
        </div>
        <div className="bg-gray-100 rounded-xl p-4 shadow-sm hover:bg-gray-200 transition">
          <p className="text-sm text-gray-500">Last Ride</p>
          <p className="text-lg font-bold text-gray-700">{lastRideDate}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 shadow-sm hover:bg-red-100 transition">
          <p className="text-sm text-gray-500">Total Cancelled</p>
          <p className="text-2xl font-bold text-red-600">{cancelled}</p>
        </div>
      </div>
    </div>
  );
};

export default RideSummary;
