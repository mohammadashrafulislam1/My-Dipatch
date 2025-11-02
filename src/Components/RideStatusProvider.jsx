// RideStatusProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";

const RideStatusContext = createContext();

export const useRideStatus = () => {
  const context = useContext(RideStatusContext);
  if (!context) {
    throw new Error("useRideStatus must be used within a RideStatusProvider");
  }
  return context;
};

export default function RideStatusProvider({ children }) {
  const { user } = useAuth();
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch active rides for the current user
  const fetchActiveRides = async () => {
    if (!user?._id) {
      setActiveRide(null);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://my-dipatch-backend.onrender.com/api/rides`);
      
      if (response.ok) {
        const responseData = await response.json();
        const allRides = responseData.rides || responseData.data || [];
        
        // Filter for active rides
        const activeRides = allRides.filter(ride => {
          const matchesUser = ride.customerId === user._id;
          const activeStatuses = ['accepted', 'on_the_way', 'in_progress'];
          const isActive = activeStatuses.includes(ride.status);
          return matchesUser && isActive;
        });
        
        // Set the first active ride if any exist
        setActiveRide(activeRides.length > 0 ? activeRides[0] : null);
      }
    } catch (error) {
      console.error("Error fetching active rides:", error);
      setActiveRide(null);
    } finally {
      setLoading(false);
    }
  };

  // Poll for ride updates periodically
  useEffect(() => {
    fetchActiveRides();
    
    const interval = setInterval(fetchActiveRides, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [user?._id]);

  // Clear active ride when user logs out
  useEffect(() => {
    if (!user) {
      setActiveRide(null);
    }
  }, [user]);

  const value = {
    activeRide,
    setActiveRide,
    loading,
    refreshRides: fetchActiveRides
  };

  return (
    <RideStatusContext.Provider value={value}>
      {children}
    </RideStatusContext.Provider>
  );
}