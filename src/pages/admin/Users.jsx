import { INITIAL_APPOINTMENTS } from "../../utils/constants";

export default function Users() {
  const users = INITIAL_APPOINTMENTS.map((appointment) => ({
    name: appointment.customerName,
    email: appointment.customerEmail,
  }));

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-rose-600">Admin</p>
        <h1 className="mt-2 text-3xl font-black text-stone-950">Clients</h1>
      </div>
      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        {users.map((user) => (
          <div key={user.email} className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 p-4 last:border-b-0">
            <span className="font-bold text-stone-950">{user.name}</span>
            <span className="text-sm text-stone-600">{user.email}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
