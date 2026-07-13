import {
  Star,
  Calendar,
  MessageSquare,
  User,
  Scissors,
  ThumbsUp,
} from "lucide-react";

const reviews = [
  {
    id: 1,
    customer: "Ram Sharma",
    service: "Hair Cut",
    rating: 5,
    date: "18 Jul 2026",
    comment:
      "Excellent haircut! Very professional and friendly.",
    response:
      "Thank you for your wonderful feedback!",
  },
  {
    id: 2,
    customer: "Sita KC",
    service: "Hair Spa",
    rating: 4,
    date: "16 Jul 2026",
    comment:
      "Service was very good. The massage was relaxing.",
    response: "",
  },
  {
    id: 3,
    customer: "Hari Thapa",
    service: "Hair Coloring",
    rating: 5,
    date: "15 Jul 2026",
    comment:
      "Perfect color and great customer service.",
    response:
      "Glad you liked it. Looking forward to seeing you again.",
  },
];

export default function StaffReviews() {
  return (
    <section className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-black text-stone-900">
          My Reviews
        </h1>

        <p className="mt-2 text-stone-500">
          View customer feedback and ratings.
        </p>
      </div>

      {/* Summary */}

      <div className="grid gap-4 md:grid-cols-4">

        <SummaryCard
          title="Average Rating"
          value="4.8"
          icon={<Star className="text-yellow-500" />}
        />

        <SummaryCard
          title="Total Reviews"
          value="86"
          icon={<MessageSquare className="text-blue-600" />}
        />

        <SummaryCard
          title="5 Star"
          value="71"
          icon={<ThumbsUp className="text-green-600" />}
        />

        <SummaryCard
          title="This Month"
          value="18"
          icon={<Calendar className="text-rose-600" />}
        />

      </div>

      {/* Filters */}

      <div className="flex flex-wrap gap-3">

        <button className="rounded-full bg-rose-600 px-5 py-2 text-white">
          All
        </button>

        <button className="rounded-full border px-5 py-2 hover:bg-stone-100">
          5 Star
        </button>

        <button className="rounded-full border px-5 py-2 hover:bg-stone-100">
          4 Star
        </button>

        <button className="rounded-full border px-5 py-2 hover:bg-stone-100">
          3 Star
        </button>

      </div>

      {/* Reviews */}

      <div className="space-y-5">

        {reviews.map((review) => (

          <div
            key={review.id}
            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-5">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                    <User className="text-rose-600" />
                  </div>

                  <div>

                    <h3 className="font-bold">
                      {review.customer}
                    </h3>

                    <p className="text-sm text-stone-500">
                      {review.date}
                    </p>

                  </div>

                </div>

              </div>

              <div className="text-right">

                <div className="flex gap-1">

                  {[1,2,3,4,5].map((star)=>(
                    <Star
                      key={star}
                      size={18}
                      fill={
                        star <= review.rating
                          ? "#facc15"
                          : "transparent"
                      }
                      className="text-yellow-400"
                    />
                  ))}

                </div>

              </div>

            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-rose-600">

              <Scissors size={16} />

              {review.service}

            </div>

            <p className="mt-4 leading-7 text-stone-700">
              {review.comment}
            </p>

            {review.response && (

              <div className="mt-5 rounded-lg bg-stone-100 p-4">

                <p className="mb-1 text-sm font-semibold text-stone-600">
                  Admin Response
                </p>

                <p className="text-sm text-stone-700">
                  {review.response}
                </p>

              </div>

            )}

          </div>

        ))}

      </div>

    </section>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        {icon}

        <span className="text-3xl font-black">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm text-stone-500">
        {title}
      </p>
    </div>
  );
}