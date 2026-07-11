import { useEffect } from "react";

function AddReview({ showReview, setShowReview }) {
  // 🔒 Disable background scroll
  useEffect(() => {
    if (showReview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showReview]);

  if (!showReview) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 🔲 Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setShowReview(false)}
      />

      {/* 🧾 Modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl p-6 shadow-lg animate-scaleIn">
        <h3 className="text-xl font-bold mb-4">Write Your Review</h3>

        <select className="w-full border p-3 rounded mb-4">
          <option value="5">5 ⭐</option>
          <option value="4">4 ⭐</option>
          <option value="3">3 ⭐</option>
          <option value="2">2 ⭐</option>
          <option value="1">1 ⭐</option>
        </select>

        <textarea
          placeholder="Write your review"
          className="w-full border p-3 rounded mb-4"
          rows={4}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowReview(false)}
            className="border px-5 py-2 rounded"
          >
            Cancel
          </button>

          <button className="bg-blue-600 text-white px-5 py-2 rounded">
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddReview;