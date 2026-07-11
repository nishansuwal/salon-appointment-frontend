import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiStar,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { useState } from "react";
import { getStatusColor } from "../../utils/getStatusColor";
import LargeModal from "../../components/common/LargeModal";
import ReviewForm from "../../components/forms/ReviewForm";

// Schema
// id
// user_id
// appointment_id
// rating
// status
// review
// admin_note

// appointment_services

// id
// appointment_id
// service_id
// staff_id
// price
// duration
// status

const reviews = [
  {
    id: 1,
    userId: 1,
    appointmentId: 1,
    customer: "Ram Sharma",
    service: "Hair Cut",
    staff: "Sita Rai",
    rating: 5,
    status: "Approved",
    date: "10 Jul 2026",
    review:
      "Excellent service. The staff was professional and friendly. Highly recommended!",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 2,
    customer: "Anita KC",
    service: "Facial",
    staff: "Hari KC",
    rating: 4,
    status: "Pending",
    date: "09 Jul 2026",
    review: "Very relaxing experience. Will definitely visit again.",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 3,
    customer: "Suman Rai",
    service: "Massage",
    staff: "Ram Sharma",
    rating: 3,
    status: "Cancelled",
    date: "08 Jul 2026",
    review: "Service was okay but waiting time was longer than expected.",
    avatar: "https://i.pravatar.cc/150?img=44",
  },
];

export default function AdminReviews() {
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };
  return (
    <section className="space-y-6">
      {/* Header */}
      <LargeModal
        open={isModalOpen}
        title={selectedReview ? "Edit Review" : "Add Review"}
        onClose={() => setIsModalOpen(false)}
      >
        <ReviewForm review={selectedReview} onClose={() => setIsModalOpen(false)} />
      </LargeModal>

      <div>
        <h1 className="mt-1 text-3xl font-black text-stone-900">
          Customer Reviews
        </h1>

        <p className="mt-2 text-stone-500">View and manage customer reviews.</p>
      </div>

      {/* Filters */}

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

            <input
              type="text"
              placeholder="Search review..."
              className="w-full rounded-lg border border-stone-300 py-3 pl-11 pr-4 outline-none focus:border-rose-500"
            />
          </div>

          <select className="rounded-lg border border-stone-300 px-4 py-3">
            <option>All Ratings</option>
            <option>5 Stars</option>
            <option>4 Stars</option>
            <option>3 Stars</option>
            <option>2 Stars</option>
            <option>1 Star</option>
          </select>

          <select className="rounded-lg border border-stone-300 px-4 py-3">
            <option>All Status</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reviews */}

      <div className="grid gap-5">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
              <div className="flex gap-4">
                <img
                  src={review.avatar}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover"
                />

                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    {review.customer}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1">
                      <FiUser />
                      {review.staff}
                    </span>

                    <span>{review.service}</span>

                    <span className="flex items-center gap-1">
                      <FiCalendar />
                      {review.date}
                    </span>
                  </div>

                  <div className="mt-3 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-stone-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <span
                className={`h-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(review.status)}`}
              >
                {review.status}
              </span>
            </div>

            <p className="mt-6 leading-7 text-stone-600">{review.review}</p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-lg bg-blue-50 px-4 py-2 text-blue-600 hover:bg-blue-100"
                onClick={() => handleEdit(review)}
              >
                <FiEdit2 />
              </button>

              <button className="rounded-lg bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100">
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
