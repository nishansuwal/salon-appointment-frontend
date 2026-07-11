import { useAppointmentContext } from "../../context/AppointmentContext";
import { SERVICES, STAFF } from "../../utils/constants";

export default function AdminDashboard() {
  const { enrichedAppointments } = useAppointmentContext();
  const pending = enrichedAppointments.filter((appointment) => appointment.status === "Pending").length;
  const confirmed = enrichedAppointments.filter((appointment) => appointment.status === "Confirmed").length;

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-rose-600">Admin</p>
        <h1 className="mt-2 text-3xl font-black text-stone-950">Salon operations dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Pending", pending],
          ["Confirmed", confirmed],
          ["Services", SERVICES.length],
          ["Staff", STAFF.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-stone-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-stone-950">{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-stone-950">Service coverage</h2>
        <div className="mt-4 grid gap-3">
          {SERVICES.map((service) => (
            <div key={service.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-stone-50 p-3">
              <span className="font-bold text-stone-950">{service.name}</span>
              <span className="text-sm font-semibold text-stone-600">{service.staffIds.length} staff assigned</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
