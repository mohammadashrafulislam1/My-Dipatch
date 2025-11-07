import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import mapboxgl from "mapbox-gl";
import useAuth from "./useAuth";
import { FaMinus, FaPlus } from "react-icons/fa";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function CustomerMap() {
  const { user } = useAuth();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const socketRef = useRef(null);
  const [ride, setRide] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [currentRideId, setCurrentRideId] = useState(null);
  const [userRides, setUserRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 🕒 live clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔍 zoom handlers
  const zoomIn = () => {
    if (mapInstance.current) {
      const newZoom = mapInstance.current.getZoom() + 1;
      mapInstance.current.zoomTo(newZoom, { duration: 400 });
      setZoomLevel(newZoom);
    }
  };
  const zoomOut = () => {
    if (mapInstance.current) {
      const newZoom = mapInstance.current.getZoom() - 1;
      mapInstance.current.zoomTo(newZoom, { duration: 400 });
      setZoomLevel(newZoom);
    }
  };

  // ✅ calculate estimated arrival time (+ 3–4 min)
  const getEstimatedArrivalTime = (eta) => {
    if (!eta) return "—";
    const etaNumber = parseInt(eta); // e.g., "8 min" → 8
    const extra = Math.floor(Math.random() * 2) + 1; // random 3–4 min
    const arrival = new Date(currentTime.getTime() + (etaNumber + extra) * 60000);
    return arrival.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  // 🔄 Fetch all rides and filter by current user and status
  useEffect(() => {
    if (!user?._id) return;

    const fetchAndFilterRides = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://my-dipatch-backend.onrender.com/api/rides`);
        
        if (response.ok) {
          const responseData = await response.json();
          const allRides = responseData.rides || responseData.data || [];
          
          const userInProgressRides = allRides.filter(ride => {
            const matchesUser = ride.customerId === user._id;
            const activeStatuses = ['accepted', 'on_the_way', 'in_progress'];
            const isActive = activeStatuses.includes(ride.status);
            return matchesUser && isActive;
          });
          
          setUserRides(userInProgressRides);
          
          if (userInProgressRides.length > 0) {
            const activeRide = userInProgressRides[0];
            setRide(activeRide);
            setCurrentRideId(activeRide._id);
            // Fetch route when ride is set
            if (activeRide.pickupLocation && activeRide.dropoffLocation) {
              fetchRoute(activeRide.pickupLocation, activeRide.dropoffLocation);
            }
          } else {
            setRide(null);
            setCurrentRideId(null);
            setRouteGeometry(null);
          }
        } else {
          console.error("Failed to fetch rides:", response.status);
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterRides();
  }, [user?._id]);

  // 🗺️ Initialize Mapbox with proper loading
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-98.4936, 29.4241],
      zoom: 13,
    });

    mapInstance.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Wait for map to load completely before adding markers and layers
    mapInstance.current.on('load', () => {
      setMapLoaded(true);

      // Load driver icon
      mapInstance.current.loadImage(
        "https://i.ibb.co/Psm5vrxs/Gemini-Generated-Image-aaev1maaev1maaev-removebg-preview.png",
        (error, image) => {
          if (error) throw error;
          if (!mapInstance.current.hasImage("driver-arrow-icon")) {
            mapInstance.current.addImage("driver-arrow-icon", image);
            console.log("✅ Driver icon loaded into Mapbox style.");
          }
        }
      );

      // ✅ FIX: Add route source and layer only after style is loaded
      if (!mapInstance.current.getSource('route')) {
        mapInstance.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });
      }

      if (!mapInstance.current.getLayer('route')) {
        mapInstance.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6', // Blue color
            'line-width': 4,
            'line-opacity': 0.7
          }
        });
      }

      console.log("✅ Route layer initialized.");

      // ✅ If we already have route geometry from a previous ride, set it now
      if (routeGeometry && mapInstance.current.getSource('route')) {
        mapInstance.current.getSource('route').setData({
          type: 'Feature',
          properties: {},
          geometry: routeGeometry
        });
      }
    });

    mapInstance.current.on('error', (e) => {
      console.error("Mapbox error:", e);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        setMapLoaded(false);
      }
    };
  }, []);

  // 🔄 Update route when map becomes loaded and we have route geometry
  useEffect(() => {
    if (mapLoaded && routeGeometry && mapInstance.current?.getSource('route')) {
      mapInstance.current.getSource('route').setData({
        type: 'Feature',
        properties: {},
        geometry: routeGeometry
      });
      console.log("✅ Route geometry applied to loaded map");
    }
  }, [mapLoaded, routeGeometry]);

  // Function to fetch route from Mapbox Directions API
  const fetchRoute = async (start, end) => {
    if (!start || !end || !mapboxgl.accessToken) return;

    try {
      const startCoords = `${start.lng},${start.lat}`;
      const endCoords = `${end.lng},${end.lat}`;
      
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords};${endCoords}?` +
        `geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          setRouteGeometry(route.geometry);
          
          // ✅ Update the route source if map is loaded and source exists
          if (mapInstance.current && mapInstance.current.getSource('route')) {
            mapInstance.current.getSource('route').setData({
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            });
            console.log("✅ Route calculated and added to map.");
          } else {
            console.log("⚠️ Route calculated but map source not ready yet");
          }
        }
      } else {
        console.error("Failed to fetch route:", response.status);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  // 🔌 Connect socket and handle events
  useEffect(() => {
    if (!user?._id) return;

    if (socketRef.current) {
      return;
    }

    socketRef.current = io("https://my-dipatch-backend.onrender.com", {
      transports: ["websocket"],
      withCredentials: true,
    });

    const socket = socketRef.current;
    
    socket.on("connect", () => {
      console.log("Customer connected:", socket.id);
      socket.emit("join", { userId: user._id, role: "customer" });
      
      if (currentRideId) {
        console.log("Joining ride room on connect:", currentRideId);
        socket.emit("join-ride", { rideId: currentRideId, customerId: user._id });
      }
    });

    socket.on("ride-accepted", (rideData) => {
      console.log("🚕 Ride accepted:", rideData);
      const newRideId = rideData.rideId || rideData._id;
      
      setRide(rideData);
      setCurrentRideId(newRideId);

      setUserRides(prev => {
        const exists = prev.find(ride => ride._id === newRideId);
        if (exists) {
          return prev.map(ride => 
            ride._id === newRideId 
              ? { ...ride, ...rideData, status: "in_progress" } 
              : ride
          );
        }
        return [...prev, { ...rideData, status: "in_progress" }];
      });

      // Fetch route when ride is accepted
      if (rideData.pickupLocation && rideData.dropoffLocation) {
        fetchRoute(rideData.pickupLocation, rideData.dropoffLocation);
      }

      socket.emit("join-ride", { rideId: newRideId, customerId: user._id });
      socket.join(newRideId);
    });

    socket.on("driver-location-update", (data) => {
      console.log("📍 Driver location update received:", data);
      
      if (data.location) {
        setDriverLocation(data.location);
        
        // Update route with current driver position
        if (ride?.dropoffLocation) {
          const start = { lat: data.location.lat, lng: data.location.lng };
          fetchRoute(start, ride.dropoffLocation);
        }
      } else if (data.lat && data.lng) {
        setDriverLocation(data);
        
        // Update route with current driver position
        if (ride?.dropoffLocation) {
          const start = { lat: data.lat, lng: data.lng };
          fetchRoute(start, ride.dropoffLocation);
        }
      }
    });

    socket.on("location-update", (data) => {
      console.log("📍 Fallback location update:", data);
      if (data.location) {
        setDriverLocation(data.location);
        
        // Update route with current driver position
        if (ride?.dropoffLocation) {
          const start = { lat: data.location.lat, lng: data.location.lng };
          fetchRoute(start, ride.dropoffLocation);
        }
      }
    });

    socket.on("driver-location-disconnected", ({ driverId }) => {
      console.log("❌ Driver stopped sharing location:", driverId);
      setDriverLocation(null);
      // Clean up the map source/layer as well
      const map = mapInstance.current;
      if (map && map.getLayer("driver-layer-customer")) {
        map.removeLayer("driver-layer-customer");
        map.removeSource("driver-location");
      }
    });

    socket.on("ride-completed", (completedRide) => {
      console.log("✅ Ride completed:", completedRide);
      const completedRideId = completedRide.rideId || completedRide._id;
      
      setRide(null);
      setCurrentRideId(null);
      setDriverLocation(null);
      setRouteGeometry(null);
      
      setUserRides(prev => 
        prev.filter(ride => {
          const rideId = ride._id || ride.rideId;
          return rideId !== completedRideId;
        })
      );
      
      // Clean up the map sources/layers
      const map = mapInstance.current;
      if (map) {
        if (map.getLayer("driver-layer-customer")) {
          map.removeLayer("driver-layer-customer");
          map.removeSource("driver-location");
        }
        // Clear route
        if (map.getSource('route')) {
          map.getSource('route').setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          });
        }
      }
    });

    socket.onAny((eventName, ...args) => {
      if (eventName.includes('location') || eventName.includes('driver') || eventName.includes('ride')) {
        console.log("🔍 [DEBUG] Socket event:", eventName, args);
      }
    });

    return () => {
      console.log("Cleaning up socket connection");
      socket.offAny();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id, currentRideId, ride?.dropoffLocation]);

  // 🔄 Auto-reconnect to ride room when currentRideId changes
  useEffect(() => {
    if (socketRef.current?.connected && currentRideId) {
      console.log("Joining ride room:", currentRideId);
      socketRef.current.emit("join-ride", { 
        rideId: currentRideId, 
        customerId: user._id 
      });
    }
  }, [currentRideId, user?._id]);

  // 🚗 DRIVER LOCATION UPDATE: Update driver marker and route
  useEffect(() => {
    if (!driverLocation || !mapInstance.current || !mapLoaded) return;

    const { lat, lng, bearing = 0 } = driverLocation;
    const newLngLat = [lng, lat];
    const map = mapInstance.current;

    // Prepare the GeoJSON data for the driver's current position and heading
    const driverGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: newLngLat },
          properties: { bearing: bearing },
        },
      ],
    };

    // 1. Check if the source already exists
    if (map.getSource("driver-location")) {
      // Update the data in the existing source for smooth movement
      map.getSource("driver-location").setData(driverGeoJSON);
    } else if (map.hasImage("driver-arrow-icon")) {
      // 2. Create Source and Layer if the map is loaded AND the icon is loaded
      map.addSource("driver-location", {
        type: "geojson",
        data: driverGeoJSON,
      });

      map.addLayer({
        id: "driver-layer-customer",
        type: "symbol",
        source: "driver-location",
        layout: {
          "icon-image": "driver-arrow-icon",
          "icon-size": 0.2,
          "icon-rotate": ["get", "bearing"],
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      });
      console.log("✅ Driver Symbol Layer created.");
    }

    // 3. Center map smoothly on driver
    map.easeTo({
      center: newLngLat,
      bearing,
      zoom: 15,
      duration: 1000,
      essential: true
    });

    // 4. Add cleanup function to remove the source/layer when location stops updating
    return () => {
      if (map.getLayer("driver-layer-customer") && !driverLocation) {
        map.removeLayer("driver-layer-customer");
        map.removeSource("driver-location");
      }
    };

  }, [driverLocation, mapLoaded]);

  // Function to handle ride selection
  const handleRideSelect = (selectedRide) => {
    const rideId = selectedRide._id;
    setRide(selectedRide);
    setCurrentRideId(rideId);
    
    // Fetch route for selected ride
    if (selectedRide.pickupLocation && selectedRide.dropoffLocation) {
      fetchRoute(selectedRide.pickupLocation, selectedRide.dropoffLocation);
    }
  };

  // Function to manually refresh rides
  const refreshRides = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`https://my-dipatch-backend.onrender.com/api/rides`);
      
      if (response.ok) {
        const responseData = await response.json();
        const allRides = responseData.rides || responseData.data || [];
        
        const userInProgressRides = allRides.filter(ride => 
          ride.customerId === user._id && 
          ['accepted', 'on_the_way', 'in_progress'].includes(ride.status)
        );
        
        setUserRides(userInProgressRides);
        
        if (userInProgressRides.length > 0 && !currentRideId) {
          const activeRide = userInProgressRides[0];
          setRide(activeRide);
          setCurrentRideId(activeRide._id);
          
          // Fetch route for the active ride
          if (activeRide.pickupLocation && activeRide.dropoffLocation) {
            fetchRoute(activeRide.pickupLocation, activeRide.dropoffLocation);
          }
        } else if (userInProgressRides.length === 0) {
          setRide(null);
          setCurrentRideId(null);
          setRouteGeometry(null);
        }
      }
    } catch (error) {
      console.error("Error refreshing rides:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debug: Check map state
  useEffect(() => {
    if (mapInstance.current && mapLoaded) {
      console.log("✅ Map is ready for layers");
      console.log("Route source exists:", !!mapInstance.current.getSource('route'));
      console.log("Route layer exists:", !!mapInstance.current.getLayer('route'));
    }
  }, [mapLoaded]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapRef} className="w-full h-full" />
        {/* ======================= 🧭 UBER-STYLE INFO PANEL ======================= */}
      {ride && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 
                        bg-white shadow-2xl rounded-2xl px-6 py-4 w-[330px]
                        text-center border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            🚗 Your Ride Information
          </h3>

          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <p><span className="font-semibold">ETA:</span> {ride.eta || "—"}</p>
            <p>
              <span className="font-semibold">Estimated Arrival:</span>{" "}
              {getEstimatedArrivalTime(ride.eta)}
            </p>
            <p><span className="font-semibold">Distance:</span> {ride.distance || "—"}</p>
            <p>
  <span className="font-semibold">Current Time:</span>{" "}
  {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
</p>

          </div>

          {/* Driver Info */}
          {ride.driverId ? (
            <div className="mt-3 text-gray-800">
              <p className="font-semibold">👨‍✈️ Driver Assigned</p>
              <p>{ride.driverFirstName || "John"} {ride.driverLastName || "Doe"}</p>
            </div>
          ) : (
            <p className="mt-3 text-gray-500 italic">Waiting for driver...</p>
          )}
        </div>
      )}

      {/* ======================= 🔍 ZOOM BUTTONS ======================= */}
      <div className="absolute bottom-6 right-6 flex flex-col space-y-2 z-10">
        <button
          onClick={zoomIn}
          className="p-3 bg-white shadow-lg rounded-full hover:bg-gray-200 transition"
          title="Zoom In"
        >
          <FaPlus />
        </button>
        <button
          onClick={zoomOut}
          className="p-3 bg-white shadow-lg rounded-full hover:bg-gray-200 transition"
          title="Zoom Out"
        >
          <FaMinus />
        </button>
      </div>

      
      {/* Status Panel */}
      <div className="absolute top-4 left-4 bg-white shadow-md rounded-lg px-4 py-2 min-w-64">
        <p className="font-semibold text-gray-800">
          {ride ? "Driver On The Way 🚕" : "Waiting for driver to accept..."}
        </p>
        
        {currentRideId && (
          <p className="text-xs text-blue-600 mb-1">Ride ID: {currentRideId}</p>
        )}
        
        {driverLocation ? (
          <div>
            <p className="text-sm text-green-600 font-medium">📍 Live tracking active</p>
            <p className="text-xs text-gray-600 mt-1">
              Lat: {driverLocation.lat?.toFixed(4)}, Lng: {driverLocation.lng?.toFixed(4)}
            </p>
            {driverLocation.bearing && (
              <p className="text-xs text-gray-600">Heading: {Math.round(driverLocation.bearing)}°</p>
            )}
            {routeGeometry && (
              <p className="text-xs text-blue-600 mt-1">🚗 Route displayed</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No driver location yet</p>
        )}
      </div>

      {/* Refresh Button */}
      <div className="absolute top-36 left-4 bg-white shadow-md rounded-lg px-4 py-2">
        <button 
          onClick={refreshRides}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh Rides"}
        </button>
      </div>

      {/* User's Active Rides Panel */}
      {userRides.length > 0 && (
        <div className="absolute top-4 right-4 bg-white shadow-md rounded-lg px-4 py-3 min-w-80 max-w-96 max-h-80 overflow-y-auto">
          <h3 className="font-bold text-gray-800 mb-2">Your Active Rides</h3>
          {userRides.map((userRide) => {
            const rideId = userRide._id;
            const isActive = rideId === currentRideId;
            
            return (
              <div 
                key={rideId}
                className={`p-3 mb-2 rounded border cursor-pointer transition-all ${
                  isActive
                    ? 'bg-blue-50 border-blue-300' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => handleRideSelect(userRide)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">
                      Ride: {rideId?.slice(-8)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Status: <span className="capitalize">{userRide.status}</span>
                    </p>
                    {userRide.driverId && (
                      <p className="text-xs text-green-600">Driver assigned</p>
                    )}
                  </div>
                  {isActive && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Active</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="absolute top-32 left-4 bg-white shadow-md rounded-lg px-4 py-2">
          <p className="text-sm text-gray-600">Loading rides...</p>
        </div>
      )}

      {/* Map Loading State */}
      {!mapLoaded && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-md rounded-lg px-4 py-2">
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      )}

      {/* No Rides State */}
      {!loading && userRides.length === 0 && (
        <div className="absolute top-32 left-4 bg-white shadow-md rounded-lg px-4 py-2">
          <p className="text-sm text-gray-600">No active rides found</p>
        </div>
      )}

      {/* Debug panel */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white text-xs p-2 rounded">
        <div>Socket: {socketRef.current?.connected ? "✅ Connected" : "❌ Disconnected"}</div>
        <div>Ride: {ride ? "✅ Set" : "❌ None"}</div>
        <div>Location: {driverLocation ? "✅ Active" : "❌ None"}</div>
        <div>Route: {routeGeometry ? "✅ Displayed" : "❌ None"}</div>
        <div>User Rides: {userRides.length} found</div>
        <div>Current Ride ID: {currentRideId || "None"}</div>
        <div>Map Loaded: {mapLoaded ? "✅ Yes" : "❌ No"}</div>
        <div>Route Geometry: {routeGeometry ? "✅ Set" : "❌ None"}</div>
      </div>
    </div>
  );
}