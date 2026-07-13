import { CalendarDays, Clock3, Star, CheckCircle2, User } from "lucide-react";

const todayAppointments = [
  {
    id: 1,
    customer: "Ram Sharma",
    service: "Hair Cut",
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    customer: "Sita KC",
    service: "Hair Spa",
    time: "11:30 AM",
    status: "In Progress",
  },
  {
    id: 3,
    customer: "Hari Thapa",
    service: "Hair Coloring",
    time: "2:00 PM",
    status: "Pending",
  },
];

export default function StaffDashboard() {
  return (
    <section className="space-y-8">
      {/* Welcome */}

      <div>
        <h1 className="text-3xl font-black text-stone-900">
          Good Morning, Sita 👋
        </h1>

        <p className="mt-2 text-stone-500">Here's what's happening today.</p>
      </div>

      {/* Cards */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Today's Appointments"
          value="8"
          icon={<CalendarDays />}
          color="bg-blue-50 text-blue-600"
        />

        <DashboardCard
          title="Completed"
          value="5"
          icon={<CheckCircle2 />}
          color="bg-green-50 text-green-600"
        />

        <DashboardCard
          title="Average Rating"
          value="4.9"
          icon={<Star />}
          color="bg-yellow-50 text-yellow-600"
        />

        <DashboardCard
          title="Working Hours"
          value="8 hrs"
          icon={<Clock3 />}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Grid */}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Today's Schedule */}

        <div className="xl:col-span-2 rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 p-5">
            <h2 className="text-xl font-bold">Today's Schedule</h2>
          </div>

          <div className="divide-y">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-wrap items-center justify-between gap-5 p-5 hover:bg-stone-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                    <User className="text-rose-600" />
                  </div>

                  <div>
                    <h3 className="font-bold">{appointment.customer}</h3>

                    <p className="text-sm text-stone-500">
                      {appointment.service}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="font-semibold">{appointment.time}</p>

                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      appointment.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : appointment.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>

                <button className="rounded-lg bg-rose-600 px-5 py-2 font-semibold text-white hover:bg-rose-700">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}

        <div className="space-y-6">
          {/* Next Appointment */}

          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Next Appointment</h2>

            <div className="mt-5 rounded-lg bg-rose-50 p-5">
              <p className="text-sm text-stone-500">10:00 AM</p>

              <h3 className="mt-1 text-xl font-bold">Hair Cut</h3>

              <p className="mt-2 text-stone-600">Customer: Ram Sharma</p>

              <button className="mt-5 w-full rounded-lg bg-rose-600 py-3 font-semibold text-white hover:bg-rose-700">
                View Appointment
              </button>
            </div>
          </div>

          {/* Rating */}

          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Performance</h2>

            <div className="mt-6 text-center">
              <div className="text-6xl font-black text-yellow-500">4.9</div>

              <div className="mt-3 text-yellow-500 text-2xl">★★★★★</div>

              <p className="mt-3 text-stone-500">Based on 186 Reviews</p>
            </div>
          </div>

          {/* Quick Stats */}

          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Quick Stats</h2>

            <div className="mt-5 space-y-4">
              <StatRow title="Pending Services" value="3" />

              <StatRow title="Completed Today" value="5" />

              <StatRow title="Cancelled" value="1" />

              <StatRow title="Upcoming" value="4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500">{title}</p>

          <h2 className="mt-2 text-3xl font-black">{value}</h2>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

function StatRow({ title, value }) {
  return (
    <div className="flex items-center justify-between border-b border-stone-100 pb-3 last:border-none">
      <span className="text-stone-600">{title}</span>

      <span className="font-bold">{value}</span>
    </div>
  );
}
