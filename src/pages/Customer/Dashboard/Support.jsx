import React, { useState, useEffect } from "react";
import { FaHeadset, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { endPoint } from "../../../Components/ForAPIs";
import useAuth from "../../../Components/useAuth";

const Support = () => {
  const [issue, setIssue] = useState("");
  const [tickets, setTickets] = useState([]);
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, token } = useAuth();

  // Identify if user is driver or customer (IMPORTANT)
  const userType = user?.role === "driver" ? "driver" : "customer";

  // 🔹 Fetch tickets + FAQs on load
  useEffect(() => {
    if (!token ) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${endPoint}/support/${userType}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTickets(res.data.tickets || []);
        setFaqList(res.data.faqs || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [userType, user]);

  // 🔹 Submit ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issue.trim()) return;

    setLoading(true);

    try {
      await axios.post(
        `${endPoint}/support/ticket/${userType}`,
        { issue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIssue("");

      // Refresh after sending
      const res = await axios.get(`${endPoint}/support/${userType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
          <h1 className="text-2xl font-bold text-blue-900">
            {userType === "driver" ? "Driver Support Center" : "Customer Support Center"}
          </h1>
          <p className="text-gray-600 mt-2">
            We're here to help you with any issue or inquiry.
          </p>
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
              {tickets.map((ticket) => (
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

        {/* FAQ Section */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>

          {faqList.length === 0 ? (
            <p className="text-gray-500 text-sm">No FAQs available.</p>
          ) : (
            <div className="space-y-4">
              {faqList.map((faq) => (
                <div key={faq._id} className="border-b pb-4">
                  <p className="font-medium">{faq.question}</p>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
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
