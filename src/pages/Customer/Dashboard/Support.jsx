import React, { useState, useEffect } from "react";
import { FaHeadset, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { endPoint } from "../../../Components/ForAPIs";
import useAuth from "../../../Components/useAuth";

const Support = () => {
  const [issue, setIssue] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user} = useAuth()
  // ✅ Fetch tickets on load
  useEffect(() => {
    const fetchTickets = async () => {
      try {
       const res = await axios.get(`${endPoint}/support/driver`, {
  headers: {
    Authorization: `Bearer ${user?.token}`,
  },
});
        setTickets(res.data.tickets || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTickets();
  }, []);

  // ✅ Submit ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issue.trim()) return;

    setLoading(true);
    try {
      await axios.post(
        `${endPoint}/support/ticket/driver`,
        { issue },
        {
  headers: {
    Authorization: `Bearer ${user?.token}`,
  },
}
      );
      setIssue("");
      // Refresh tickets
      const res = await axios.get(`${endPoint}/support/driver`, {
  headers: {
    Authorization: `Bearer ${user?.token}`,
  },
});
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-2 md:p-10 mt-6 md:mt-0">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <FaHeadset className="text-4xl text-blue-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-blue-900">Support Center</h1>
          <p className="text-gray-600 mt-2">
            We're here to help you with any issue or inquiry.
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="flex flex-col items-center text-center">
            <FaPhoneAlt className="text-xl text-blue-600 mb-2" />
            <h3 className="font-semibold text-sm">Call Us</h3>
            <p className="text-sm text-gray-500">+1 (123) 456-7890</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaEnvelope className="text-xl text-blue-600 mb-2" />
            <h3 className="font-semibold text-sm">Email</h3>
            <p className="text-sm text-gray-500">support@mydispatch.com</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaHeadset className="text-xl text-blue-600 mb-2" />
            <h3 className="font-semibold text-sm">Live Chat</h3>
            <p className="text-sm text-gray-500">Available 9 AM – 6 PM</p>
          </div>
        </div>

        {/* Submit Ticket */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Submit a Support Ticket</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <textarea
              rows="4"
              placeholder="Describe your issue..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </div>

        {/* Tickets List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Tickets</h2>
          {tickets.length === 0 ? (
            <p className="text-gray-500 text-sm">No tickets submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {tickets?.map((ticket) => (
                <div
                  key={ticket._id}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{ticket.issue}</p>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      ticket.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : ticket.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
