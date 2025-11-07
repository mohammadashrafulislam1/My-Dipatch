import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { BsPaperclip } from "react-icons/bs";
import { MdImage } from "react-icons/md";
import useAuth from "../../../Components/useAuth";
import axios from "axios";
import { endPoint } from "../../../Components/ForAPIs";
import io from "socket.io-client";

const allowedStatuses = ["accepted", "on_the_way", "in_progress"];

const CustomerChat = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ride, setRide] = useState(null);
  const [rideStatus, setRideStatus] = useState(null);
  const [driver, setDriver] = useState(null);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket connection
  useEffect(() => {
    if (!user?._id) return;

    socket.current = io("https://my-dipatch-backend.onrender.com/", {
      query: { userId: user._id, role: user.role },
      withCredentials: true,
    });

    socket.current.emit("join", { userId: user._id, role: user.role });

    socket.current.on("chat-message", (msg) => {
  if (msg.senderId === user._id) return;
  setMessages((prev) => [...prev, msg]);
});


    return () => socket.current.disconnect();
  }, [user?._id, user?.role]);

  // Fetch active ride and chat history
  useEffect(() => {
    const fetchRides = async () => {
      if (!user?._id) return;
  
      try {
        const res = await axios.get(`${endPoint}/rides`, { withCredentials: true });
        const customerRides = res.data.rides?.filter(r => r.customerId === user._id) || [];
        const activeRide = customerRides.find(r => allowedStatuses.includes(r.status));
  
        if (activeRide) {
          setRide(activeRide);
          setRideStatus(activeRide.status);
  
          if (activeRide.driverId) {
            const driverRes = await axios.get(`${endPoint}/user/${activeRide.driverId}`, { withCredentials: true });
            setDriver(driverRes.data);
          }
          console.log("Chat activeRide:", activeRide);
  
          const chatRes = await axios.get(`${endPoint}/chat/customer/${activeRide._id}`, { withCredentials: true });
          console.log("Chat response:", chatRes);
          setMessages(chatRes.data.messages || []);
        } else {
          setRide(null);
          setDriver(null);
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to fetch rides/chat:", err);
      }
    };
  
    fetchRides();
  }, [user?._id]);
  

  const canChat = rideStatus && allowedStatuses.includes(rideStatus);

  // Send message
 const handleSend = async () => {
  if (!canChat || (!message.trim() && !selectedFile)) return;
  if (!driver?._id) return alert("No driver connected.");

  const chatData = {
    rideId: ride._id,
    senderId: user._id,
    senderRole: user.role,
    recipientId: driver._id,
  };

  try {
    // If a file is selected
    if (selectedFile) {
      const tempUrl = URL.createObjectURL(selectedFile);

      // ✅ Show optimistic message instantly
      const optimisticMsg = {
        senderId: user._id,
        recipientId: driver._id,
        fileUrl: tempUrl,
        fileType: selectedFile.type.startsWith("image/") ? "image" : "file",
        createdAt: new Date().toISOString(),
        optimistic: true,
      };
      setMessages((prev) => [...prev, optimisticMsg]);

      // Upload to backend
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("rideId", chatData.rideId);
      formData.append("senderId", chatData.senderId);
      formData.append("senderRole", chatData.senderRole);
      formData.append("recipientId", chatData.recipientId);

      const fileRes = await axios.post(`${endPoint}/chat/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Replace the optimistic message with the confirmed one
      setMessages((prev) =>
        prev
          .filter((m) => !m.optimistic)
          .concat({
            ...fileRes.data.chat,
            createdAt: new Date().toISOString(),
          })
      );

      // Cleanup file input
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";

    } else {
      // --- Send text ---
      const textData = { ...chatData, text: message.trim() };

      const optimisticText = {
        senderId: user._id,
        recipientId: driver._id,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        optimistic: true,
      };
      setMessages((prev) => [...prev, optimisticText]);

      const savedMsg = await axios.post(`${endPoint}/chat/send`, textData);

      setMessages((prev) =>
        prev
          .filter((m) => !m.optimistic)
          .concat(savedMsg.data.chat)
      );
    }

    setMessage("");
  } catch (err) {
    console.error("Failed to send message:", err);
  }
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  return (
    <div className="flex h-[600px] max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r overflow-y-auto">
        <div className="p-4 font-semibold text-lg border-b">Drivers</div>
        {driver ? (
  <div
    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-200 transition-all"
    title={`Chat with ${driver.firstName}`}
  >
    <div className="relative">
      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-lg font-semibold">
        {driver?.firstName?.charAt(0)}
      </div>
    </div>
    <div>
      <div className="font-medium">
        {driver.firstName} {driver.lastName}
      </div>
      <div className="text-sm text-green-500">Active Chat</div>
    </div>
  </div>
) : (
  <div className="p-4 text-gray-500">No Active Ride</div>
)}

      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {rideStatus && (
          <div
            className={`px-4 py-1 text-sm text-center ${
              canChat ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            Ride status: {rideStatus} {canChat ? "(Messaging enabled)" : "(Messaging disabled)"}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.length === 0 && (
            <div className="text-gray-500 text-center mt-20">No messages yet</div>
          )}

{messages.map((msg, i) => {
  const fromMe = msg.senderId === user._id; // true if this is your message
  return (
    <div
      key={i}
      className={`max-w-[300px] px-3 py-2 rounded-xl text-sm break-words ${
        fromMe
          ? "ml-auto bg-blue-500 text-white"
          : "bg-gray-200 text-gray-800"
      }`}
    >
      {msg.fileUrl ? (
        msg.fileType === "image" ? (
          <img
            src={msg.fileUrl}
            alt="Shared"
            className="w-[250px] h-[200px] rounded-md object-cover"
          />
        ) : (
          <a
            href={msg.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline flex items-center gap-1"
          >
            <BsPaperclip /> {msg.fileName || "Download File"}
          </a>
        )
      ) : (
        msg.message
      )}
      <div className="text-xs opacity-70 mt-1 text-right">
        {new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
})}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 border-t flex flex-col gap-2">
          {selectedFile && (
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
              {selectedFile.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt={selectedFile.name}
                  className="h-16 rounded"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <BsPaperclip className="text-2xl text-gray-600" />
                  <span className="truncate max-w-xs">{selectedFile.name}</span>
                </div>
              )}
              <button
                onClick={handleRemoveFile}
                className="text-red-600 font-bold px-2"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label className="cursor-pointer text-xl text-gray-600">
              <BsPaperclip />
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </label>
            <label className="cursor-pointer text-xl text-gray-600">
              <MdImage />
              <input
                type="file"
                accept="image/*"
                hidden
                ref={imageInputRef}
                onChange={handleFileChange}
              />
            </label>

            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 outline-none"
              placeholder={
                canChat
                  ? "Type your message..."
                  : "Messaging disabled for current ride status"
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              
                  disabled={!!selectedFile || !canChat}
            />
            <button
              onClick={handleSend}
              className={`p-2 rounded-full ${
                canChat
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!canChat}
            >
              <IoSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerChat;
