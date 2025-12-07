// components/ReviewModal.jsx
import { useState } from "react";
import { FaStar } from "react-icons/fa";

const suggestedComments = [
  "Excellent ride, very comfortable!",
  "Driver was friendly and professional.",
  "Smooth and quick trip.",
  "Car was clean and well-maintained.",
  "Average experience, nothing special."
];

const ReviewModal = ({ ride, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0); // start empty
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating before submitting!");
      return;
    }
    onSubmit({ rideId: ride._id, rating, comment });
  };

  return (
    <div className="fixed inset-0 md:bottom-0 bottom-16 z-50 flex items-end md:items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 md:rounded-t-3xl md:rounded-xl shadow-2xl w-full md:max-w-md p-6 md:p-8 transform transition-all duration-300 ease-out translate-y-10 md:translate-y-0 animate-slideUp">
        
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">
          Rate Your Ride
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          How was your ride with <span className="font-semibold">{ride.driver?.name || "your driver"}</span>?
        </p>

        {/* Star Rating */}
        <div className="flex gap-1 justify-center mb-6">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <FaStar
                key={index}
                className={`cursor-pointer transition-transform duration-200 text-3xl ${
                  starValue <= (hoverRating || rating)
                    ? "text-yellow-400 scale-125"
                    : "text-gray-300 dark:text-gray-600"
                }`}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
              />
            );
          })}
        </div>

        {/* Suggested Comments */}
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestedComments.map((cmt, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setComment(cmt)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {cmt}
            </button>
          ))}
        </div>

        {/* Comment Textarea */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          rows={4}
          className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 mb-6 resize-none shadow-inner"
        />

        {/* Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition shadow-lg font-medium"
          >
            Submit
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes slideUp {
            0% { transform: translateY(100px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-slideUp {
            animation: slideUp 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default ReviewModal;
