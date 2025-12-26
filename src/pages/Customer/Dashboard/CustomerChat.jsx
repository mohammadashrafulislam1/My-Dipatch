import { useState, useEffect, useRef, useMemo } from "react";
import { IoSend } from "react-icons/io5";
import { BsPaperclip } from "react-icons/bs";
import { MdImage, MdOutlineSupportAgent } from "react-icons/md";
import useAuth from "../../../Components/useAuth";
import axios from "axios";
import { endPoint } from "../../../Components/ForAPIs";
import io from "socket.io-client";

import { v4 as uuidv4 } from "uuid";

const clientMessageId = uuidv4();
const allowedStatuses = ["accepted", "on_the_way", "in_progress"];

const CustomerChat = () => {
  const { user, token } = useAuth();
  const [sending, setSending] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ride, setRide] = useState(null);
  const [rideStatus, setRideStatus] = useState(null);
  const [driver, setDriver] = useState(null);
  const [activeChat, setActiveChat] = useState("driver"); // default selected participant
const [adminIds, setAdminIds] = useState([]);

useEffect(() => {
  const fetchSupportChat = async () => {
    if (activeChat !== "cs") return;

    try {
      const res = await axios.get(`${endPoint}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) =>
        dedupeByClientMessageId([
          ...prev,
          ...res.data.messages.map(msg => ({ ...msg, clientMessageId: msg._id }))
        ])
      );
    } catch (err) {
      console.error("Failed to fetch support chat:", err);
    }
  };

  fetchSupportChat();
}, [activeChat]);

useEffect(() => {
  if (!user?._id) return;

  socket.current = io("https://my-dipatch-backend.onrender.com/", {
    query: { userId: user._id, role: user.role },
    headers: { Authorization: `Bearer ${token}` },
  });

  socket.current.emit("join", { userId: user._id, role: user.role });

  // Driver messages
  socket.current.on("chat-message", (msg) => {
      console.log(msg)
  setMessages((prev) => dedupeByClientMessageId([...prev, msg]));
});

  // Support messages
 socket.current.on("support-message", (msg) => {
  setMessages(prev => dedupeByClientMessageId([...prev, {
    ...msg,
    clientMessageId: msg.clientMessageId || msg._id
  }]));
});

  return () => socket.current.disconnect();
}, [user?._id, user?.role]);

useEffect(() => {
  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${endPoint}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
      const admins = res.data?.filter(u => u.role === "admin");
      console.log(admins)
      setAdminIds(admins.map(a => a._id));
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    }
  };

  fetchAdmins();
}, []);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

const canChat = useMemo(() => {
  // Customer Service chat always enabled
  if (activeChat === "cs") return true;

  // Driver chat only for active ride statuses
  if (activeChat === "driver" && rideStatus) {
    return allowedStatuses.includes(rideStatus);
  }

  return false;
}, [rideStatus, activeChat]);


  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat]);

useEffect(() => {
  if (activeChat !== "cs") return;

  const fetchSupportChat = async () => {
    try {
      const res = await axios.get(`${endPoint}/chat/support`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(dedupeByClientMessageId(res.data.messages.map(msg => ({
        ...msg,
        clientMessageId: msg.clientMessageId || msg._id
      }))));
    } catch (err) {
      console.error("Failed to fetch support chat:", err);
    }
  };

  fetchSupportChat();
}, [activeChat, token]);


const dedupeByClientMessageId = (msgs) => {
    const map = new Map();

    for (const msg of msgs) {
      const key = msg.clientMessageId || msg._id;
      if (!map.has(key)) {
        map.set(key, msg);
      } else if (map.get(key).optimistic && !msg.optimistic) {
        map.set(key, msg);
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  };

  // Fetch active ride and chat history
useEffect(() => {
  const fetchRides = async () => {
    if (!user?._id || activeChat !== "driver") return;

    try {
      const res = await axios.get(`${endPoint}/rides`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const customerRides = res.data.rides?.filter(r => r.customerId === user._id) || [];
      const activeRide = customerRides.find(r => allowedStatuses.includes(r.status));
      if (!activeRide) {
        setRide(null);
        setDriver(null);
        setMessages([]); // clear messages
        return;
      }

      setRide(activeRide);
      setRideStatus(activeRide.status);

      if (activeRide.driverId) {
        const driverRes = await axios.get(`${endPoint}/user/${activeRide.driverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDriver(driverRes.data);
      }

      const chatRes = await axios.get(`${endPoint}/chat/customer/${activeRide._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // merge with existing messages and deduplicate
      setMessages((prev) =>
        dedupeByClientMessageId([
          ...prev,
          ...(chatRes.data.messages || []).map(msg => ({
            ...msg,
            clientMessageId: msg.clientMessageId || msg._id,
          }))
        ])
      );
    } catch (err) {
      console.error("Failed to fetch rides/chat:", err);
    }
  };

  fetchRides();
}, [user?._id, activeChat]);

  // Filter messages by selected participant
const displayedMessages = useMemo(() => {
  const filtered = messages.filter(msg => {
    if (activeChat === "driver") {
      return (msg.senderId === user._id && msg.recipientId === driver?._id) ||
             (msg.senderId === driver?._id && msg.recipientId === user._id);
    }
    if (activeChat === "cs") {
      return (msg.senderId === user._id && adminIds.includes(msg.recipientId)) ||
             (msg.senderRole === "admin" && msg.recipientId === user._id);
    }
    return false;
  });

  return dedupeByClientMessageId(filtered);
}, [messages, activeChat, user._id, driver?._id, adminIds]);


const dedupedMessages = (() => {
  const map = new Map();
  console.log(displayedMessages)
  for (const msg of displayedMessages) {
    const key = msg.clientMessageId || msg._id;
    if (!map.has(key)) {
      map.set(key, msg);
    } else if (map.get(key).optimistic && !msg.optimistic) {
      map.set(key, msg);
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
})();

 // Send message
const handleSend = async () => {
  if (sending) return; // prevent double sending
  if (!canChat || (!message.trim() && !selectedFile)) return;

  setSending(true); // disable button

  // For customer service, send to all admins
  const recipientIds = activeChat === "cs" ? adminIds : [driver?._id];
  
  if (!recipientIds || recipientIds.length === 0) {
    setSending(false);
    return alert("No recipients available");
  }

  try {
    if (selectedFile) {
      // File upload logic (similar to what you have)
      const tempUrl = URL.createObjectURL(selectedFile);

      // Optimistic messages for all recipients
      const optimisticMsgs = recipientIds.map((id) => ({
          
        senderId: user._id,
        recipientId: id,
        fileUrl: tempUrl,
        fileType: selectedFile.type.startsWith("image/") ? "image" : "file",
        createdAt: new Date().toISOString(),
        optimistic: true,
      }));
      // setMessages((prev) => [...prev, ...optimisticMsgs]);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("senderId", user._id);
      formData.append("senderRole", user.role);
formData.append("clientMessageId", clientMessageId);

      // Different endpoint for support file upload
      const endpoint = activeChat === "cs" 
        ? `${endPoint}/chat/support/upload`  // You'll need to create this
        : `${endPoint}/chat/upload`;

      for (let id of recipientIds) {
        formData.set("recipientId", id);
        if (activeChat === "driver") {
          formData.set("rideId", ride?._id);
        }

        const fileRes = await axios.post(endpoint, formData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        });

        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map(m => 
            m.optimistic && m.recipientId === id 
              ? { ...fileRes.data.chat, createdAt: new Date().toISOString() }
              : m
          ).filter(m => !m.optimistic || m.recipientId !== id)
        );
      }

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
    } else {
      // Text message logic
      const clientMessageId = uuidv4();
      
      // Optimistic text messages for all recipients
      const optimisticTexts = recipientIds.map((id) => ({
       
        senderId: user._id,
        recipientId: id,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        optimistic: true,
        rideId: activeChat === "driver" ? ride?._id : null, // Important: null for support
      }));
      
      // setMessages((prev) => [...prev, ...optimisticTexts]);

      // Use different endpoint for support vs driver chat
      if (activeChat === "cs") {
        // Send support message to all admins at once
        const textData = {
          text: message.trim(),
          recipientId: adminIds, // Array of admin IDs
          clientMessageId,
        };

        const savedMsg = await axios.post(`${endPoint}/chat/support/send`, textData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Replace all optimistic messages with real ones
        setMessages((prev) =>
          prev.filter((m) => !m.optimistic).concat(savedMsg.data.chat)
        );
      } else {
        // Driver chat - send individually
        for (let id of recipientIds) {
          const textData = {
  rideId: ride?._id,
  senderId: user._id,        // ✅ REQUIRED
  senderRole: user.role,     // ✅ REQUIRED
  recipientId: id,
  text: message.trim(),
  clientMessageId,
};
          
          const savedMsg = await axios.post(`${endPoint}/chat/send`, textData, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setMessages((prev) =>
            prev.map(m => 
              m.optimistic && m.recipientId === id 
                ? savedMsg.data.chat 
                : m
            ).filter(m => !m.optimistic || m.recipientId !== id)
          );
        }
      }
    }

    setMessage("");
  } catch (err) {
    console.error("Failed to send message:", err);
    // Remove optimistic messages on error
    setMessages((prev) => prev.filter(m => !m.optimistic));
  }finally {
    setSending(false); // re-enable button
    setMessage("");     // clear input
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

  const MessageBubble = ({ msg }) => {
    const fromMe = msg.senderId === user._id;
    const isCustomerService = msg.senderRole === "admin";
    const isRightAligned = fromMe;

    return (
      <div
        className={`max-w-[300px] px-3 py-2 rounded-xl text-sm break-words ${
          isRightAligned ? "ml-auto" : "mr-auto"
        } ${
          fromMe
            ? "bg-blue-500 text-white"
            : isCustomerService
            ? "bg-purple-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {isCustomerService && (
          <div className="font-bold text-xs mb-1 opacity-90">Customer Service</div>
        )}

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
  };

  return (
    <div className="flex md:mt-10 border border-1 h-[600px] max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r overflow-y-auto">
        <div className="p-4 font-semibold text-lg border-b">Chats</div>


        {/* Customer Service Demo */}
        <div
          onClick={() => setActiveChat("cs")}
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-200 transition-all mt-2 ${
            activeChat === "cs" ? "bg-gray-100" : ""
          }`}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-lg font-semibold">
              <MdOutlineSupportAgent className="text-3xl"/>
            </div>
          </div>
          <div>
            <div className="font-medium">Customer Service</div>
            <div className="text-sm text-green-500">Admin</div>
          </div>
          
        </div>
        
          <div className="divider"></div>
        {/* Driver */}
        {driver && (
          <div
            onClick={() => setActiveChat("driver")}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-200 transition-all ${
              activeChat === "driver" ? "bg-gray-100" : ""
            }`}
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
              <div className="text-sm text-green-500">Driver</div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Ride status */}
        {rideStatus && (
          <div
            className={`px-4 py-1 text-sm text-center ${
              canChat ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            Ride status: {rideStatus} {canChat ? "(Messaging enabled)" : "(Messaging disabled)"}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {displayedMessages.length === 0 && (
            <div className="text-gray-500 text-center mt-20">No messages yet</div>
          )}

          {dedupedMessages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        {canChat && (
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
  className={`p-2 rounded-full flex items-center justify-center gap-1 ${
    canChat && !sending
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
  disabled={!canChat || sending}
>
  {sending ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    <IoSend />
  )}
</button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerChat;
