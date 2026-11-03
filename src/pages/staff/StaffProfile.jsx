import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Lock,
  Clock3,
  Star,
  CalendarDays,
} from "lucide-react";

import { fetchRecords } from "../../store/apps/staff/staffProfiles";

export default function StaffProfile() {
  const dispatch = useDispatch();

  const [status, setStatus] = useState(false);

  // Get staff profile from Redux
  const staffState = useSelector(
    (state) => state.staffProfile.data
  );

  useEffect(() => {
    dispatch(fetchRecords());
  }, [dispatch]);

  // Handle API response structure
  const profile = staffState?.data ?? staffState;

  const user = profile?.user ?? {};

  const categories = profile?.categories ?? [];
  const availability = profile?.availability ?? [];

  // Update status when profile is loaded
  useEffect(() => {
    if (profile) {
      setStatus(Boolean(profile.is_active));
    }
  }, [profile?.is_active]);

  // Format joining date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get category names
  const specialization = categories
    .map((category) => category.name)
    .join(", ");

  if (!profile) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center text-stone-500">
        Loading staff profile...
      </div>
    );
  }

  return (
    <section className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-stone-900">
          My Profile
        </h1>

        <p className="mt-2 text-stone-500">
          Manage your personal information.
        </p>
      </div>

      <form className="space-y-6">

        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT PROFILE CARD */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col items-center">

              <div className="relative">

                <img
                  src={
                    user.avatar ||
                    "https://i.pravatar.cc/200"
                  }
                  alt={user.name || "Staff"}
                  className="h-36 w-36 rounded-full object-cover"
                />

                <button
                  type="button"
                  className="absolute bottom-1 right-1 rounded-full bg-rose-600 p-2 text-white"
                >
                  <Camera size={18} />
                </button>

              </div>

              <h2 className="mt-5 text-xl font-bold">
                {user.name || "Staff Member"}
              </h2>

              <p className="text-stone-500">
                {profile.position || "No position assigned"}
              </p>

              <span
                className={`mt-3 rounded-full px-4 py-1 text-sm font-semibold ${
                  status
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {status ? "Active" : "Inactive"}
              </span>

            </div>

            {/* STAFF DETAILS */}
            <div className="mt-8 space-y-4 text-sm">

              <Info
                title="Employee ID"
                value={`EMP-${String(profile.id).padStart(3, "0")}`}
              />

              <Info
                title="Joined"
                value={formatDate(profile.created_at)}
              />

              <Info
                title="Experience"
                value={`${profile.experience ?? 0} Years`}
              />

              <Info
                title="Specialization"
                value={specialization || "Not assigned"}
              />

              <Info
                title="Average Rating"
                value={profile.avg_rating ?? "Not rated"}
              />

            </div>
          </div>

          {/* RIGHT INFORMATION */}
          <div className="space-y-6 lg:col-span-2">

            {/* PERSONAL INFORMATION */}
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-lg font-bold">
                Personal Information
              </h2>

              <div className="grid gap-5 md:grid-cols-2">

                <Input
                  icon={<User size={18} />}
                  label="Full Name"
                  value={user.name}
                />

                <Input
                  icon={<Mail size={18} />}
                  label="Email"
                  value={user.email}
                />

                <Input
                  icon={<Phone size={18} />}
                  label="Phone"
                  value={user.phone}
                />

                <Input
                  icon={<Briefcase size={18} />}
                  label="Position"
                  value={profile.position}
                />

                <div className="md:col-span-2">

                  <label className="mb-2 block font-semibold">
                    Bio
                  </label>

                  <textarea
                    rows={5}
                    value={profile.bio ?? ""}
                    readOnly
                    className="w-full rounded-lg border border-stone-300 bg-stone-50 p-4 outline-none"
                    placeholder="No bio available"
                  />

                </div>

              </div>
            </div>

            {/* WORK INFORMATION */}
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-lg font-bold">
                Work Information
              </h2>

              <div className="grid gap-5 md:grid-cols-2">

                <Input
                  icon={<Award size={18} />}
                  label="Experience"
                  value={`${profile.experience ?? 0} Years`}
                />

                <Input
                  icon={<Star size={18} />}
                  label="Average Rating"
                  value={profile.avg_rating ?? "Not rated"}
                />

                {/* SPECIALIZATIONS */}
                <div className="md:col-span-2">

                  <label className="mb-3 block font-semibold">
                    Specializations
                  </label>

                  {categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">

                      {categories.map((category) => (
                        <span
                          key={category.id}
                          className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                        >
                          {category.name}
                        </span>
                      ))}

                    </div>
                  ) : (
                    <p className="text-sm text-stone-500">
                      No specializations assigned.
                    </p>
                  )}

                </div>

                {/* STATUS */}
                <div>

                  <label className="mb-2 block font-semibold">
                    Status
                  </label>

                  <button
                    type="button"
                    onClick={() => setStatus((prev) => !prev)}
                    className={`relative flex h-7 w-14 items-center rounded-full transition ${
                      status ? "bg-rose-600" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`h-6 w-6 rounded-full bg-white transition ${
                        status ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>

                </div>

              </div>
            </div>

            {/* AVAILABILITY */}
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">

              <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
                <Clock3 size={20} />
                Working Availability
              </h2>

              {availability.length > 0 ? (
                <div className="space-y-3">

                  {availability.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-stone-50 p-4"
                    >

                      <span className="font-semibold capitalize text-stone-800">
                        {item.day_of_week}
                      </span>

                      <span className="text-sm text-stone-600">
                        {item.start_time} - {item.end_time}
                      </span>

                    </div>
                  ))}

                </div>
              ) : (
                <p className="text-sm text-stone-500">
                  No availability records found.
                </p>
              )}

            </div>

          </div>
        </div>

      </form>
    </section>
  );
}

// Reusable information component
function Info({ title, value }) {
  return (
    <div>
      <p className="text-xs uppercase text-stone-500">
        {title}
      </p>

      <p className="mt-1 font-semibold">
        {value || "N/A"}
      </p>
    </div>
  );
}

// Reusable input component
function Input({ label, icon, value }) {
  return (
    <div>
      <label className="mb-2 block font-semibold">
        {label}
      </label>

      <div className="relative">

        <span className="absolute left-3 top-3 text-stone-400">
          {icon}
        </span>

        <input
          type="text"
          value={value ?? ""}
          readOnly
          className="w-full rounded-lg border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 outline-none"
        />

      </div>
    </div>
  );
}