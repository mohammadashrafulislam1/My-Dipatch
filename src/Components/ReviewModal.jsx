// components/ReviewModal.jsx
import { useState } from "react";

const ReviewModal = ({ ride, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit({ rideId: ride._id.$oid, rating, comment });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Review Your Ride</h2>
        <p className="mb-2">Rate your ride with {ride.driverId.$oid}</p>
        
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 w-full mb-2"
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="border p-2 w-full mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
