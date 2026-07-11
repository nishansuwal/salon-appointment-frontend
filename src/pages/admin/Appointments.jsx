import AppointmentCard from "../../components/appointment/AppointmentCard";
import { useAppointmentContext } from "../../context/AppointmentContext";

export default function AdminAppointments() {
  const { enrichedAppointments, updateStatus, cancelAppointment } =
    useAppointmentContext();

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-black text-stone-950">
          Manage appointments
        </h1>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search customer or service..."
          className="w-full rounded-lg border px-4 py-3 md:max-w-sm"
        />

        <div className="flex gap-3">
          <select className="rounded-lg border px-4 py-3">
            <option>All Status</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>

          <select className="rounded-lg border px-4 py-3">
            <option>Newest</option>
            <option>Oldest</option>
            <option>Name A-Z</option>
            <option>Name Z-A</option>
          </select>
        </div>
      </div>
      <div className="grid gap-4">
        {enrichedAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onStatusChange={updateStatus}
            onCancel={cancelAppointment}
          />
        ))}
      </div>
    </section>
  );
}
