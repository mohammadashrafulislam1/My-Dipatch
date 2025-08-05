import React from "react";
import { FaHeadset, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Support = () => {
  return (
    <div className="min-h-screen p-2 md:p-10 mt-6 md:mt-0">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <div className="text-center mb-8">
          <FaHeadset className="text-4xl text-blue-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-blue-900">Customer Support</h1>
          <p className="text-gray-600 mt-2">We're here to help you with any issue or inquiry.</p>
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

        {/* Contact Form */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Send us a message</h2>
          <form className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              className="border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;
