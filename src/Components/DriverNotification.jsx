import { BellIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function DriverNotification() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // For testing - replace with your actual driver ID
  const driverId = "test-driver-123";
  
  useEffect(() => {
    // Connect to socket server without authentication
    const socket = io('https://my-dipatch-backend.vercel.app');
    
    // Identify as driver
    socket.emit('driver-join', driverId);
    
    // Handle new ride requests
    socket.on('new-ride-request', (ride) => {
      setNotifications(prev => [{
        id: Date.now(),
        ride,
        read: false,
        timestamp: new Date()
      }, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => socket.disconnect();
  }, []);

  const handleAccept = (rideId) => {
    console.log('Accepting ride:', rideId);
    // Add your acceptance logic here
    markAsRead(rideId);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? {...n, read: true} : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-white rounded-full shadow-lg"
      >
        <BellIcon className="h-6 w-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-3 bg-gray-800 text-white flex justify-between items-center">
            <h3 className="font-semibold">Ride Requests</h3>
            <button 
              onClick={clearAll}
              className="text-sm hover:text-gray-300"
            >
              Clear All
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No notifications</p>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`border-b p-4 ${notification.read ? 'bg-gray-50' : 'bg-yellow-50'}`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">New Ride Request</span>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="mt-2 text-sm">
                    <span className="font-semibold">From:</span> {notification.ride.pickup}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">To:</span> {notification.ride.dropoff}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Price:</span> ${notification.ride.price}
                  </p>
                  
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => handleAccept(notification.ride.requestId)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 rounded text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 py-1 rounded text-sm"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}