import AppointmentCard from "../../components/appointment/AppointmentCard";
import { useAppointmentContext } from "../../context/AppointmentContext";

export default function MyAppointments() {
  const { enrichedAppointments, cancelAppointment } = useAppointmentContext();

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-rose-600">Appointments</p>
        <h1 className="mt-2 text-3xl font-black text-stone-950">My appointments</h1>
      </div>
      <div className="grid gap-4">
        {enrichedAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onCancel={cancelAppointment}
          />
        ))}
      </div>
    </section>
  );
}
