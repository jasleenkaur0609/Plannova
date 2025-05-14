import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Star } from "lucide-react";

const VendorReviews = () => {
  const [reviews, setReviews] = useState([]);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const fetchReviews = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const res = await fetch(`${baseUrl}/vender/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-6 md:p-10 bg-[#F7E1D7] min-h-screen">
      <h2 className="text-3xl font-bold text-[#4A5759] mb-6">Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-[#4A5759]">No reviews yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-[#DEDBD2]"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#4A5759]">
                  {review.customerName}
                </h3>
                <div className="flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <Star key={idx} size={16} fill="#fbbf24" stroke="#fbbf24" />
                  ))}
                </div>
              </div>

              <p className="text-sm text-[#4A5759] mb-2">{review.comment}</p>

              <div className="text-xs text-[#4A5759] mb-1">
                <strong>Service:</strong> {review.serviceName}
              </div>
              <div className="text-xs text-[#4A5759] mb-1">
                <strong>Event:</strong> {review.eventName}
              </div>

              <p className="text-xs text-gray-500">
                {new Date(review.reviewedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorReviews;
