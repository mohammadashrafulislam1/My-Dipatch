import { useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { MdCancel } from "react-icons/md";
import { IoLocationSharp, IoAdd } from "react-icons/io5";
import { MdOutlineLocationOn } from "react-icons/md";

const Default = () => {
  const [midwayStops, setMidwayStops] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const orderHistory = [
    { name: "Ashraful Islam", address: "Osler st – S4P 1W9", status: "In progress" },
    { name: "Jhon Snow", address: "Rose st – S3P 1W9", status: "Completed" },
    { name: "Katriena Saw", address: "14th ave – S5P 1T9", status: "Completed" },
    { name: "Tom Gray", address: "Broadway – S4T 0H9", status: "Completed" },
    { name: "Jane F.", address: "Victoria Ave – S4N 0P4", status: "Completed" },
  ];

  const visibleOrders = showAll ? orderHistory : orderHistory.slice(0, 3);

  const addMidwayStop = () => setMidwayStops([...midwayStops, ""]);
  const removeStop = (indexToRemove) =>
    setMidwayStops(midwayStops.filter((_, i) => i !== indexToRemove));

  const handleRequest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Ride requested successfully!");
    }, 1500);
  };

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            icon: <FaClipboardList className="text-blue-600 text-2xl" />,
            label: "Total Orders",
            value: 75,
            bg: "bg-blue-100",
          },
          {
            icon: <TbTruckDelivery className="text-green-600 text-2xl" />,
            label: "Total Delivered",
            value: 357,
            bg: "bg-green-100",
          },
          {
            icon: <MdCancel className="text-yellow-600 text-2xl" />,
            label: "Total Cancelled",
            value: 65,
            bg: "bg-yellow-100",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg p-4 shadow flex items-center gap-4"
          >
            <div className={`${card.bg} p-3 rounded-full`}>{card.icon}</div>
            <div>
              <p className="text-xl font-semibold">{card.value}</p>
              <p className="text-sm text-gray-600">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Request a Ride */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Request a ride</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-sm text-gray-700">Drivers Available</p>
          </div>

          <div className="mb-3 flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
            <IoLocationSharp className="text-blue-500" />
            <input
              type="text"
              placeholder="Pickup location"
              className="w-full bg-transparent outline-none"
            />
          </div>


          {/* Midway Stops */}
          {midwayStops.map((_, index) => (
            <div key={index} className="mb-3 flex items-center gap-2">
              <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2 w-full">
                <MdOutlineLocationOn className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Optional Midway Stop"
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <button
                onClick={() => removeStop(index)}
                className="text-red-500 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={addMidwayStop}
            className="text-blue-600 text-sm mb-3 hover:underline"
          >
            + Add Stop
          </button>

          {/* Drop Location */}
          <div className="mb-3 flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
            <IoLocationSharp className="text-red-500" />
            <input
              type="text"
              placeholder="Drop location"
              className="w-full bg-transparent outline-none"
            />
          </div>

          <textarea
            placeholder="Message/Instructions"
            className="w-full bg-gray-100 px-3 py-2 rounded outline-none resize-none mb-4"
            rows={3}
          ></textarea>
          <button
            onClick={handleRequest}
            disabled={loading}
            className="bg-black text-white w-full py-2 rounded font-semibold"
          >
            {loading ? "Requesting..." : "Request"}
          </button>

          {/* Regina Map */}
          <div className="w-full mt-6 rounded-xl overflow-hidden">
            <iframe
              title="Regina Map"
              width="100%"
              height="250"
              className="rounded-xl"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d45523.89642954821!2d-104.67554336896333!3d50.44521053608486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x531c1e64b52f3f3f%3A0x6a0ef84f87355f51!2sRegina%2C%20SK!5e0!3m2!1sen!2sca!4v1720364567890!5m2!1sen!2sca"
            ></iframe>
          </div>
        </div>

        {/* Right Column: Order History, Summary, Wallet, Upcoming Rides */}
        <div>
          {/* Order History */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-lg font-semibold mb-4">Order History</h2>

            {visibleOrders.map((order, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg p-4 flex items-center justify-between mb-3"
              >
                <div>
                  <p className="font-semibold">{order.name}</p>
                  <p className="text-sm text-gray-600">{order.address}</p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}

            {orderHistory.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-blue-600 hover:underline text-sm mt-2"
              >
                {showAll ? "See Less" : "See More"}
              </button>
            )}
          </div>
{/* Ride Summary */}
<div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow mt-6">
  <h2 className="text-lg font-semibold mb-6 text-gray-800">Your Ride Summary</h2>
  
  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-center">
    <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
      <p className="text-sm text-gray-600 mb-1">Total Rides</p>
      <p className="text-2xl font-bold text-blue-600">84</p>
    </div>
    <div className="bg-green-50 rounded-lg p-4 shadow-sm">
      <p className="text-sm text-gray-600 mb-1">Total Distance</p>
      <p className="text-2xl font-bold text-green-600">215 km</p>
    </div>
  </div>
</div>


        </div>
      </div>
    </div>
  );
};

export default Default;
