// RideStatusIndicator.jsx
import { useRideStatus } from "./RideStatusProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RideStatusIndicator() {
  const { activeRide, loading } = useRideStatus();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  // Smooth entrance animation
  useEffect(() => {
    if (activeRide && !loading) {
      setIsVisible(true);
      // Start pulsing animation
      const pulseInterval = setInterval(() => {
        setIsPulsing(prev => !prev);
      }, 2000);
      return () => clearInterval(pulseInterval);
    } else {
      setIsVisible(false);
      setIsPulsing(false);
    }
  }, [activeRide, loading]);

  if (loading || !activeRide) {
    return null;
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'accepted':
        return { 
          text: 'Driver Accepted', 
          gradient: 'from-yellow-400 to-orange-500',
          glow: 'shadow-yellow-500/25',
          icon: '🚕',
          timeEstimate: '5-10 min'
        };
      case 'on_the_way':
        return { 
          text: 'Driver On The Way', 
          gradient: 'from-blue-500 to-purple-600',
          glow: 'shadow-blue-500/25',
          icon: '🎯',
          timeEstimate: '3-7 min'
        };
      case 'in_progress':
        return { 
          text: 'Ride In Progress', 
          gradient: 'from-green-500 to-emerald-600',
          glow: 'shadow-green-500/25',
          icon: '⚡',
          timeEstimate: 'Almost there!'
        };
      default:
        return { 
          text: 'Active Ride', 
          gradient: 'from-gray-500 to-gray-600',
          glow: 'shadow-gray-500/25',
          icon: '📱',
          timeEstimate: ''
        };
    }
  };

  const handleTrackRide = () => {
    if (activeRide._id) {
      navigate(`/track/${activeRide._id}`);
    }
  };

  const statusInfo = getStatusDisplay(activeRide.status);

  return (
    <div className={`
      fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50
      transition-all duration-500 ease-out
      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
    `}>
      <button
        onClick={handleTrackRide}
        className={`
          relative
          bg-gradient-to-r ${statusInfo.gradient}
          text-white
          px-6 py-4 rounded-2xl
          shadow-2xl ${statusInfo.glow}
          backdrop-blur-md bg-opacity-95
          transform transition-all duration-300
          hover:scale-105 hover:shadow-xl
          active:scale-95
          min-w-[320px] max-w-[90vw]
          flex items-center justify-between
          cursor-pointer
          border border-white border-opacity-20
          overflow-hidden
          group
        `}
      >
        {/* Animated background pulse */}
        <div className={`
          absolute inset-0 rounded-2xl
          bg-gradient-to-r ${statusInfo.gradient}
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          ${isPulsing ? 'animate-pulse-subtle' : ''}
        `}></div>

        {/* Content container */}
        <div className="relative z-10 flex items-center justify-between w-full">
          {/* Left side - Status info */}
          <div className="flex items-center gap-4 flex-1">
            {/* Animated icon */}
            <div className={`
              text-2xl transform transition-transform duration-300
              group-hover:scale-110
              ${isPulsing ? 'animate-bounce-subtle' : ''}
            `}>
              {statusInfo.icon}
            </div>
            
            {/* Text content */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3">
                {/* Pulsing dot */}
                <div className={`
                  w-3 h-3 rounded-full bg-white
                  ${isPulsing ? 'animate-ping' : ''}
                `}></div>
                
                <div className="flex flex-col">
                  <span className="font-bold text-sm whitespace-nowrap">
                    {statusInfo.text}
                  </span>
                  {statusInfo.timeEstimate && (
                    <span className="text-xs opacity-90 font-medium mt-1">
                      {statusInfo.timeEstimate}
                    </span>
                  )}
                </div>
              </div>
              
              {activeRide.driverId && (
                <p className="text-xs opacity-80 mt-2 font-mono">
                  ID: {activeRide._id?.slice(-8)}
                </p>
              )}
            </div>
          </div>

          {/* Right side - Track button */}
          <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all duration-300">
            <span className="text-sm font-semibold opacity-90">Track</span>
            <div className={`
              transform transition-transform duration-300
              group-hover:translate-x-1
              ${isPulsing ? 'animate-bounce-horizontal' : ''}
            `}>
              <span className="text-lg">→</span>
            </div>
          </div>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </button>

      {/* Progress bar for in_progress status */}
      {activeRide.status === 'in_progress' && (
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white/60 rounded-full animate-progress"></div>
        </div>
      )}
    </div>
  );
}

