import { SALON } from "../../utils/constants";

export default function Settings() {
  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-rose-600">Admin</p>
        <h1 className="mt-2 text-3xl font-black text-stone-950">Salon settings</h1>
      </div>
      <div className="grid gap-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        {Object.entries(SALON).map(([key, value]) => (
          <div key={key} className="grid gap-1 sm:grid-cols-[180px_1fr]">
            <p className="text-sm font-bold capitalize text-stone-500">{key}</p>
            <p className="font-semibold text-stone-950">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
