import { Briefcase, Award, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function StaffCard({ staff }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative flex justify-center bg-gradient-to-b from-rose-50 to-white pt-8">
        <img
          src={staff.avatar || "/user.jpg"}
          alt={staff.name}
          className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
        />
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-stone-900">{staff.name}</h3>

        <p className="mt-1 font-medium text-rose-600">{staff.position}</p>

        {/* Average Rating */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={
                  star <= Math.round(staff.avg_rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-stone-300"
                }
              />
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-stone-500">
          <Briefcase size={16} />
          <span>{staff.specialization}</span>
        </div>

        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-stone-500">
          <Award size={16} />
          <span>{staff.experience} Years Experience</span>
        </div>

        {/* Skills */}
        {staff.skills?.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {staff.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
        <Link
          to={`/services?staff=${staff.id}`}
          className="mt-3 inline-block text-sm font-semibold text-rose-600 hover:text-rose-700"
        >
          Book with {staff.name.split(" ")[0]} →
        </Link>
      </div>
    </article>
  );
}
