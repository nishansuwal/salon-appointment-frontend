import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiPhone,
  FiMail,
  FiClock,
  FiBriefcase,
  FiUser,
} from "react-icons/fi";
import { useState } from "react";
import LargeModal from "../../components/common/LargeModal";
import StaffForm from "../../components/forms/StaffForm";

const staffs = [
  {
    id: 1,
    name: "Ram Sharma",
    position: "Senior Hair Stylist",
    email: "ram@gmail.com",
    phone: "9800000001",
    experience: 6,
    status: "Active",
    workingDays: "Sun - Fri",
    workingHours: "10:00 AM - 7:00 PM",
    services: ["Hair Cut", "Hair Spa", "Hair Color"],
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 2,
    name: "Anita Rai",
    position: "Makeup Artist",
    email: "anita@gmail.com",
    phone: "9800000002",
    experience: 4,
    status: "Active",
    workingDays: "Sun - Thu",
    workingHours: "9:00 AM - 6:00 PM",
    services: ["Bridal Makeup", "Party Makeup"],
    image: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 3,
    name: "Hari KC",
    position: "Massage Therapist",
    email: "hari@gmail.com",
    phone: "9800000003",
    experience: 8,
    status: "Inactive",
    workingDays: "Mon - Sat",
    workingHours: "11:00 AM - 8:00 PM",
    services: ["Massage", "Body Therapy"],
    image: "https://i.pravatar.cc/150?img=15",
  },
];

export default function Staff() {
  const [open, setOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const handleAdd = () => {
    setSelectedStaff(null);
    setOpen(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setOpen(true);
  };
  return (
    <section className="space-y-8">
      <LargeModal
        open={open}
        title={selectedStaff ? "Edit Staff" : "Add Staff"}
        onClose={() => setOpen(false)}
      >
        <StaffForm staff={selectedStaff} onClose={() => setOpen(false)} />
      </LargeModal>
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-rose-600">Staff Management</p>

          <h1 className="mt-1 text-3xl font-black text-stone-900">
            Staff Members
          </h1>

          <p className="mt-2 text-stone-500">
            Manage salon staff, schedules and assigned services.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-700"
        >
          <FiPlus />
          Add Staff
        </button>
      </div>

      {/* Filters */}

      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

            <input
              type="text"
              placeholder="Search by name, email or phone..."
              className="w-full rounded-lg border border-stone-300 py-3 pl-11 pr-4 outline-none focus:border-rose-500"
            />
          </div>

          <select className="rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-rose-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <select className="rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-rose-500">
            <option>Newest</option>
            <option>Oldest</option>
            <option>Name A-Z</option>
            <option>Name Z-A</option>
            <option>Experience</option>
          </select>
        </div>
      </div>

      {/* Staff Cards */}

      <div className="grid gap-6 lg:grid-cols-2">
        {staffs.map((staff) => (
          <div
            key={staff.id}
            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
          >
            {/* Top */}

            <div className="flex items-start gap-4">
              <img
                src={staff.image}
                alt={staff.name}
                className="h-20 w-20 rounded-full object-cover"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">
                      {staff.name}
                    </h2>

                    <p className="mt-1 text-sm text-stone-500">
                      {staff.position}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      staff.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {staff.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}

            <div className="mt-6 space-y-3 text-sm text-stone-600">
              <div className="flex items-center gap-2">
                <FiPhone />
                {staff.phone}
              </div>

              <div className="flex items-center gap-2">
                <FiMail />
                {staff.email}
              </div>

              <div className="flex items-center gap-2">
                <FiBriefcase />
                {staff.experience} Years Experience
              </div>

              <div className="flex items-center gap-2">
                <FiClock />
                {staff.workingDays} • {staff.workingHours}
              </div>
            </div>

            {/* Services */}

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-stone-700">
                Assigned Services
              </p>

              <div className="flex flex-wrap gap-2">
                {staff.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}

            <div className="mt-6 flex justify-end gap-3 border-t border-stone-200 pt-5">
              <button
                type="button"
                onClick={() => handleEdit(staff)}
                className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
              >
                <FiEdit2 />
                Edit
              </button>

              <button className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">
                <FiTrash2 />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
