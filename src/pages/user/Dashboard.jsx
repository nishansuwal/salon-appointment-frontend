import { Link } from "react-router-dom";
import AppointmentCard from "../../components/appointment/AppointmentCard";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import { useAppointmentContext } from "../../context/AppointmentContext";
import { SERVICES, STAFF } from "../../utils/constants";

export default function Dashboard() {
  const { user } = useAuth();
  const { enrichedAppointments } = useAppointmentContext();
  const upcoming = enrichedAppointments.slice(0, 2);

  return (
    <section className="grid gap-6">
      <div className="rounded-lg bg-stone-950 p-6 text-white shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-rose-200">Client dashboard</p>
        <h1 className="mt-2 text-3xl font-black">Good to see you, {user?.name || "Guest"}</h1>
        <p className="mt-2 max-w-2xl text-stone-300">
          Manage bookings, review upcoming visits, and request a new appointment with the right salon specialist.
        </p>
        <Link to="/book" className="mt-5 inline-flex">
          <Button>Book appointment</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-stone-500">Appointments</p>
          <p className="mt-2 text-3xl font-black text-stone-950">{enrichedAppointments.length}</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-stone-500">Services</p>
          <p className="mt-2 text-3xl font-black text-stone-950">{SERVICES.length}</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-stone-500">Staff available</p>
          <p className="mt-2 text-3xl font-black text-stone-950">{STAFF.length}</p>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-stone-950">Upcoming appointments</h2>
          <Link to="/appointments" className="text-sm font-bold text-rose-700">
            View all
          </Link>
        </div>
        <div className="grid gap-4">
          {upcoming.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
