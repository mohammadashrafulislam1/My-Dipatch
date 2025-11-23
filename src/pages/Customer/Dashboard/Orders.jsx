import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../Components/useAuth";
import { endPoint } from "../../../Components/ForAPIs";

const ITEMS_PER_PAGE = 20;

const Order = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  useEffect(() => {
    if (!user?._id) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${endPoint}/rides`);
        const allRides = res.data?.rides || [];

        // Filter rides where customerId matches current user
        const filtered = allRides.filter(
          (ride) => ride.customerId === user._id
        );

        setOrders(filtered);
      } catch (error) {
        console.error("Fetch orders error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <div className="p-4 text-center">Loading orders...</div>;

  if (orders.length === 0)
    return <div className="p-4 text-center">No orders found.</div>;

  // Pagination
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";

    case "accepted":
      return "bg-blue-100 text-blue-700 border border-blue-300";

    case "on_the_way":
      return "bg-indigo-100 text-indigo-700 border border-indigo-300";

    case "in_progress":
      return "bg-purple-100 text-purple-700 border border-purple-300";

    case "at_stop":
      return "bg-orange-100 text-orange-700 border border-orange-300";

    case "completed":
      return "bg-green-100 text-green-700 border border-green-300";

    case "cancelled":
      return "bg-red-100 text-red-700 border border-red-300";

    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
};


  return (
    <div className="p-4">
      {/* Showing info */}
      <div className="mb-2 text-sm font-medium">
        Showing {startIndex + 1} to {endIndex} of {totalItems} entries
      </div>

      <div className="overflow-x-auto bg-white dark:bg-white rounded-xl">
        <table className="table w-full">
          <thead className="text-black dark:text-black">
            <tr>
              <th>#</th>
              <th>Pickup</th>
              <th>Midways</th>
              <th>Dropoff</th>
              <th>Distance</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {currentOrders.map((o, index) => (
              <tr
                key={o.id || index}
                className={
                  index % 2 === 0
                    ? "bg-base-200 dark:bg-base-100 dark:text-white text-black"
                    : ""
                }
              >
                <td>{startIndex + index + 1}</td>
                <td>{o.pickup?.address}</td>
                <td>
                  {o.midwayStops?.length > 0
                    ? o.midwayStops.map((m, i) => (
                        <div key={i}>{m.address}</div>
                      ))
                    : "—"}
                </td>
                <td>{o.dropoff?.address}</td>
                <td>{o.distance}</td>
                <td>${o.customerFare}</td>
                <td>
  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(o.status)}`}>
    {o.status}
  </span>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="join mt-4 mx-auto w-full justify-center flex gap-1">
        {[...Array(totalPages).keys()].map((pageNum) => {
          const page = pageNum + 1;
          return (
            <input
              key={page}
              type="radio"
              name="options"
              aria-label={page}
              className="join-item btn btn-square"
              checked={currentPage === page}
              onChange={() => handlePageChange(page)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Order;
