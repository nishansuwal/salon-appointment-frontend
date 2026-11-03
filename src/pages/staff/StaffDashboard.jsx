import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  CalendarDays,
  Clock3,
  Star,
  CheckCircle2,
  User,
  Scissors,
  CalendarClock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { fetchStaffDashboard } from "../../store/apps/dashboard";

export default function StaffDashboard() {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const {
    staff: dashboard,
    staffLoading,
    staffError,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchStaffDashboard());
  }, [dispatch]);

  const staffInfo = dashboard?.staff ?? {};
  const stats = dashboard?.stats ?? {};
  const todayAppointments = dashboard?.today_appointments ?? [];
  const nextAppointment = dashboard?.next_appointment;

  const displayName = staffInfo.name || user?.name || "Staff";

  const statCards = [
    {
      title: "Today's Appointments",
      value: stats.today_appointments ?? 0,
      icon: CalendarDays,
      color: "bg-blue-50 text-blue-600",
      description: "Assigned appointments today",
    },
    {
      title: "Completed",
      value: stats.completed_today ?? 0,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
      description: "Completed appointments today",
    },
    {
      title: "Average Rating",
      value: Number(stats.average_rating ?? 0).toFixed(1),
      icon: Star,
      color: "bg-yellow-50 text-yellow-600",
      description: "Your customer rating",
    },
    {
      title: "Scheduled Hours",
      value: `${stats.scheduled_hours ?? 0} hrs`,
      icon: Clock3,
      color: "bg-purple-50 text-purple-600",
      description: "Total service duration today",
    },
  ];

  const formatTime = (time) => {
    if (!time) return "--";

    const [hours, minutes] = time.split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      confirmed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      in_progress: "bg-blue-100 text-blue-700",
      completed: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-red-100 text-red-700",
      no_show: "bg-stone-100 text-stone-700",
    };

    return styles[status] || "bg-stone-100 text-stone-700";
  };

  const formatStatus = (status) => {
    return status
      ? status
          .replaceAll("_", " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "Unknown";
  };

  if (staffLoading && !dashboard) {
    return (
      <section className="space-y-6">
        <div className="h-24 animate-pulse rounded-xl bg-stone-100" />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl bg-stone-100"
            />
          ))}
        </div>

        <div className="h-80 animate-pulse rounded-xl bg-stone-100" />
      </section>
    );
  }

  if (staffError && !dashboard) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-700">{staffError}</p>

        <button
          type="button"
          onClick={() => dispatch(fetchStaffDashboard())}
          className="mt-4 inline-flex items-center gap-2 font-semibold text-red-700"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      {/* Welcome */}

      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
          Staff dashboard
        </p>

        <h1 className="mt-2 text-3xl font-black text-stone-900">
          Good day, {displayName} 👋
        </h1>

        <p className="mt-2 text-stone-500">
          Here's what's happening with your appointments today.
        </p>

        {staffInfo.position && (
          <p className="mt-1 text-sm font-medium text-stone-600">
            {staffInfo.position}
          </p>
        )}
      </div>

      {/* Statistics */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <DashboardCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={<Icon size={22} />}
              color={card.color}
              description={card.description}
            />
          );
        })}
      </div>

      {/* Main Grid */}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Today's Schedule */}

        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-stone-200 p-5">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Today's Schedule
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Your assigned appointments for today
              </p>
            </div>

            <Link
              to="/staff/appointments"
              className="flex items-center gap-1 text-sm font-bold text-rose-700"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="p-10 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-stone-400" />

              <h3 className="mt-3 font-bold text-stone-900">
                No appointments today
              </h3>

              <p className="mt-1 text-sm text-stone-500">
                You don't have any assigned appointments for today.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {todayAppointments.map((item) => {
                const appointment = item.appointment;
                const status = appointment?.status;

                return (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-5 p-5 transition hover:bg-stone-50"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100">
                        <User className="text-rose-600" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-stone-900">
                          {appointment?.user?.name || "Customer"}
                        </h3>

                        <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
                          <Scissors size={14} />
                          {item.service?.name || "Service"}
                        </p>

                        <p className="mt-1 text-xs text-stone-400">
                          {appointment?.appointment_code || ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-stone-900">
                          {formatTime(item.start_time)}
                        </p>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(status)}`}
                        >
                          {formatStatus(status)}
                        </span>
                      </div>

                      <Link
                        to={`/staff/appointments/${appointment?.id}`}
                        className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side */}

        <div className="space-y-6">
          {/* Next Appointment */}

          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900">
              Next Appointment
            </h2>

            {nextAppointment ? (
              <div className="mt-5 rounded-lg bg-rose-50 p-5">
                <p className="text-sm font-semibold text-rose-700">
                  {formatTime(nextAppointment.start_time)}
                </p>

                <h3 className="mt-2 text-xl font-bold text-stone-900">
                  {nextAppointment.service?.name || "Service"}
                </h3>

                <p className="mt-2 text-sm text-stone-600">
                  Customer:{" "}
                  {nextAppointment.appointment?.user?.name || "Customer"}
                </p>

                <p className="mt-1 text-sm text-stone-600">
                  Status: {formatStatus(nextAppointment.appointment?.status)}
                </p>

                <Link
                  to={`/staff/appointments/${nextAppointment.appointment?.id}`}
                  className="mt-5 block rounded-lg bg-rose-600 py-3 text-center font-semibold text-white transition hover:bg-rose-700"
                >
                  View Appointment
                </Link>
              </div>
            ) : (
              <p className="mt-5 rounded-lg bg-stone-50 p-5 text-center text-sm text-stone-500">
                No upcoming appointments for today.
              </p>
            )}
          </div>

          {/* Performance */}

          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900">
              Your Performance
            </h2>

            <div className="mt-6 text-center">
              <div className="text-6xl font-black text-yellow-500">
                {Number(stats.average_rating ?? 0).toFixed(1)}
              </div>

              <div className="mt-3 flex justify-center gap-1 text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={22}
                    fill={
                      Number(stats.average_rating ?? 0) >= star
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
              </div>

              <p className="mt-3 text-sm text-stone-500">
                Your average customer rating
              </p>
            </div>
          </div>

          {/* Quick Stats */}

          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900">Quick Stats</h2>

            <div className="mt-5 space-y-4">
              <StatRow title="Pending" value={stats.pending_today ?? 0} />

              <StatRow
                title="In Progress"
                value={stats.in_progress_today ?? 0}
              />

              <StatRow title="Completed" value={stats.completed_today ?? 0} />

              <StatRow title="Cancelled" value={stats.cancelled_today ?? 0} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardCard({ title, value, icon, color, description }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-500">{title}</p>

          <h2 className="mt-2 text-3xl font-black text-stone-900">{value}</h2>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
      </div>

      <p className="mt-3 text-xs text-stone-500">{description}</p>
    </div>
  );
}

function StatRow({ title, value }) {
  return (
    <div className="flex items-center justify-between border-b border-stone-100 pb-3 last:border-none last:pb-0">
      <span className="text-sm text-stone-600">{title}</span>
      <span className="font-bold text-stone-900">{value}</span>
    </div>
  );
}
