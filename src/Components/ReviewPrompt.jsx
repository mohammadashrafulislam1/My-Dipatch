// components/ReviewPrompt.jsx
import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import ReviewModal from "./ReviewModal";
import axios from "axios";
import toast from "react-hot-toast";

const ReviewPrompt = ({ endPoint }) => {
  const { user, token } = useAuth();
  const [rideToReview, setRideToReview] = useState(null);

  useEffect(() => {
    const checkRideForReview = async () => {
      if (!user) return;

      try {
        const res = await fetch(`${endPoint}/rides`);
        const data = await res.json();


        const pendingRide = data.rides.find(ride => {
  const isCustomer = ride.customerId === user._id; // string comparison
  const isCompleted = ride.status === "completed";
  if (!isCustomer || !isCompleted) return false;

  const dropoffAt = ride.timestamps?.dropoffAt ? new Date(ride.timestamps.dropoffAt) : null;
  if (!dropoffAt) return false;

  const hoursSinceDropoff = (new Date() - dropoffAt) / 1000 / 3600;

  if (hoursSinceDropoff > 24) return false;

  return true;
});


        if (pendingRide) {
            
          // Check if review already exists
          const reviewRes = await axios.get(`${endPoint}/review/check/${pendingRide._id}`,{
        headers: { Authorization: `Bearer ${token}` }
      });
          
          const reviewData = await reviewRes.data;
          console.log(reviewRes)
          
          if (!reviewData.exists) setRideToReview(pendingRide);
        }
      } catch (err) {
        console.error("Error checking ride review:", err);
      }
    };

    checkRideForReview();
  }, [user]);

  const handleSubmitReview = async ({ rideId, rating, comment }) => {
  try {
    const res = await axios.post(
      `${endPoint}/review`,
      { rideId, rating, comment },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (res.status === 201) {
      toast.success("Review submitted!", {
        position: "bottom-center",
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setRideToReview(null);
    } else {
      toast.error(res.data.message || "Failed to submit review", {
        position: "bottom-center",
        duration: 3000,
      });
    }
  } catch (err) {
    console.error("Error submitting review:", err);
    toast.error(err.response?.data?.message || "Server error", {
      position: "bottom-center",
      duration: 3000,
    });
  }
};
  return rideToReview ? (
    <ReviewModal
      ride={rideToReview}
      onClose={() => setRideToReview(null)}
      onSubmit={handleSubmitReview}
    />
  ) : null;
};

export default ReviewPrompt;
