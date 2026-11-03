import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CalendarDays,
  Scissors,
  CheckCircle,
  CalendarClock,
  ArrowRight,
} from "lucide-react";

import AppointmentCard from "../../components/appointment/AppointmentCard";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import { fetchUserDashboard } from "../../store/apps/dashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const {
    user: dashboard,
    userLoading,
    userError,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchUserDashboard());
  }, [dispatch]);

  const stats = dashboard?.stats ?? {};
  const upcomingAppointments = dashboard?.upcoming_appointments ?? [];

  const statCards = [
    {
      title: "Total Appointments",
      value: stats.total_appointments ?? 0,
      icon: CalendarDays,
      description: "Appointments you have booked",
    },
    {
      title: "Services Taken",
      value: stats.total_services ?? 0,
      icon: Scissors,
      description: "Total services booked",
    },
    {
      title: "Completed",
      value: stats.completed_appointments ?? 0,
      icon: CheckCircle,
      description: "Successfully completed visits",
    },
    {
      title: "Upcoming",
      value: stats.upcoming_appointments ?? 0,
      icon: CalendarClock,
      description: "Confirmed future appointments",
    },
  ];

  return (
    <section className="grid gap-7">
      {/* Welcome Section */}
      <div className="rounded-xl bg-stone-950 p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-rose-200">
          Client dashboard
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Good to see you, {user?.name || "Guest"}
        </h1>

        <p className="mt-2 max-w-2xl text-stone-300">
          Manage your bookings, track your upcoming visits, and book your next
          salon experience with your preferred specialist.
        </p>

        <Link to="/book-appointment" className="mt-5 inline-flex">
          <Button>Book appointment</Button>
        </Link>
      </div>

      {/* Dashboard Statistics */}
      <div>
        <h2 className="mb-4 text-xl font-black text-stone-950">
          Your overview
        </h2>

        {userLoading && !dashboard ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-xl bg-stone-100"
              />
            ))}
          </div>
        ) : userError && !dashboard ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="font-medium text-red-700">{userError}</p>

            <button
              type="button"
              onClick={() => dispatch(fetchUserDashboard())}
              className="mt-3 text-sm font-bold text-red-700 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-stone-500">
                      {stat.title}
                    </p>

                    <div className="rounded-lg bg-rose-50 p-2">
                      <Icon className="h-5 w-5 text-rose-700" />
                    </div>
                  </div>

                  <p className="mt-3 text-3xl font-black text-stone-950">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-stone-950">
              Upcoming appointments
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Your next confirmed salon visits
            </p>
          </div>

          <Link
            to="/appointments"
            className="flex shrink-0 items-center gap-1 text-sm font-bold text-rose-700 hover:text-rose-800"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {userLoading && !dashboard ? (
          <div className="h-40 animate-pulse rounded-xl bg-stone-100" />
        ) : upcomingAppointments.length === 0 ? (
          <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
            <CalendarClock className="mx-auto h-10 w-10 text-stone-400" />

            <h3 className="mt-3 font-bold text-stone-900">
              No upcoming appointments
            </h3>

            <p className="mt-1 text-sm text-stone-500">
              You don't have any confirmed upcoming appointments.
            </p>

            <Link to="/book-appointment" className="mt-4 inline-flex">
              <Button>Book an appointment</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {upcomingAppointments.slice(0, 2).map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                compact
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}