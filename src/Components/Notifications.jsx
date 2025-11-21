import { useNotification } from "./NotificationContext";
import { useEffect } from "react";
import io from "socket.io-client";
import useAuth from "./useAuth";

const socket = io("https://my-dipatch-backend.onrender.com", {
  transports: ["websocket"],
});

const NotificationComp = () => {
  const { user } = useAuth();
  const { notifications, addNotification } = useNotification();

  useEffect(() => {
    if (!user?._id) return;

    socket.on("connect", () => {
      socket.emit("join", { userId: user._id, role: user.role });
    });

    socket.on("new-ride-request", (ride) => {
      addNotification(`New ride request from ${ride.pickup?.address}`);
    });

    socket.on("ride-accepted", () => {
      addNotification("Your ride has been accepted.");
    });

    socket.on("driver-location-update", ({ location }) => {
      addNotification(
        `Driver moved to (${location.lat.toFixed(4)}, ${location.lng.toFixed(
          4
        )})`
      );
    });

    socket.on("driver-location-disconnected", () => {
      addNotification("Driver went offline.");
    });

    return () => {
      socket.off("new-ride-request");
      socket.off("ride-accepted");
      socket.off("driver-location-update");
      socket.off("driver-location-disconnected");
    };
  }, [user]);

  return (
    <ul className="max-h-72 overflow-y-auto">
      {notifications.slice(0, 5).map((note) => (
        <li
          key={note.id}
          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b"
        >
          <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
          <div className="text-sm text-gray-700 leading-tight">
            <p>{note.text}</p>
            <span className="text-xs text-gray-400">Just now</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NotificationComp;
