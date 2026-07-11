import AppointmentCard from "../../components/appointment/AppointmentCard";
import { useAppointmentContext } from "../../context/AppointmentContext";

export default function AdminAppointments() {
  const { enrichedAppointments, updateStatus, cancelAppointment } = useAppointmentContext();

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-rose-600">Admin</p>
        <h1 className="mt-2 text-3xl font-black text-stone-950">Manage appointments</h1>
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
