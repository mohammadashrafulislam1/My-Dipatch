// components/ReviewPrompt.jsx
import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import ReviewModal from "./ReviewModal";

const ReviewPrompt = ({ endPoint }) => {
  const { user } = useAuth();
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
        console.log("review dropoffAt", dropoffAt)

  const hoursSinceDropoff = (new Date() - dropoffAt) / 1000 / 3600;
  if (hoursSinceDropoff > 24) return false;

  return true;
});


        if (pendingRide) {
          // Check if review already exists
          const reviewRes = await fetch(`${endPoint}/review/check/${pendingRide._id}`);
          const reviewData = await reviewRes.json();
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
      const res = await fetch(`${endPoint}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId, rating, comment })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Review submitted!");
        setRideToReview(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
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
