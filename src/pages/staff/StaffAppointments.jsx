import { useState } from "react";
import {
  Clock3,
  User,
  Phone,
  Scissors,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";

const appointments = [
  {
    id: 1,
    customer: "Ram Sharma",
    phone: "9812345678",
    service: "Hair Cut",
    date: "18 Jul 2026",
    time: "10:00 AM",
    duration: "45 min",
    status: "Confirmed",
  },
  {
    id: 2,
    customer: "Sita KC",
    phone: "9801234567",
    service: "Hair Spa",
    date: "18 Jul 2026",
    time: "11:00 AM",
    duration: "60 min",
    status: "In Progress",
  },
  {
    id: 3,
    customer: "Hari Thapa",
    phone: "9841122334",
    service: "Hair Coloring",
    date: "18 Jul 2026",
    time: "2:30 PM",
    duration: "90 min",
    status: "Completed",
  },
];

export default function StaffAppointments() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  return (
    <section className="space-y-6">
      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900">
            My Appointments
          </h1>

          <p className="mt-2 text-stone-500">
            Manage today's appointments and update service status.
          </p>
        </div>
      </div>

      {/* Filters */}

      <div className="flex flex-wrap gap-3">
        {["All", "Confirmed", "In Progress", "Completed"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              filter === item
                ? "bg-rose-600 text-white"
                : "bg-white border border-stone-300 hover:bg-stone-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Cards */}

      <div className="grid gap-5">
        {filtered.map((appointment) => (
          <div
            key={appointment.id}
            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-6">
              {/* Left */}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-rose-100 p-3">
                    <User className="text-rose-600" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      {appointment.customer}
                    </h2>

                    <p className="text-sm text-stone-500">Customer</p>
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-stone-600">
                  <p className="flex items-center gap-2">
                    <Phone size={16} />
                    {appointment.phone}
                  </p>

                  <p className="flex items-center gap-2">
                    <Scissors size={16} />
                    {appointment.service}
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock3 size={16} />
                    {appointment.date} • {appointment.time}
                  </p>

                  <p>Duration : {appointment.duration}</p>
                </div>
              </div>

              {/* Right */}

              <div className="flex flex-col items-end gap-4">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    appointment.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : appointment.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {appointment.status}
                </span>

                {appointment.status === "Confirmed" && (
                  <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
                    <PlayCircle size={18} />
                    Start Service
                  </button>
                )}

                {appointment.status === "In Progress" && (
                  <button className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700">
                    <CheckCircle2 size={18} />
                    Complete Service
                  </button>
                )}

                {appointment.status === "Completed" && (
                  <button className="rounded-lg border border-stone-300 px-5 py-3 font-semibold hover:bg-stone-100">
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
