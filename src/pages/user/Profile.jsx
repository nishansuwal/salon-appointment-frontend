import useAuth from "../../hooks/useAuth";
import { SALON } from "../../utils/constants";

export default function Profile() {
  const { user } = useAuth();

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-rose-600">Profile</p>
        <h1 className="mt-2 text-3xl font-black text-stone-950">Account details</h1>
      </div>
      <div className="grid gap-5 rounded-lg border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <p className="text-sm font-bold text-stone-500">Name</p>
          <p className="mt-1 text-lg font-black text-stone-950">{user?.name || "Guest"}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-stone-500">Email</p>
          <p className="mt-1 text-lg font-black text-stone-950">{user?.email || "Not set"}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-stone-500">Phone</p>
          <p className="mt-1 text-lg font-black text-stone-950">{user?.phone || "Not set"}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-stone-500">Preferred salon</p>
          <p className="mt-1 text-lg font-black text-stone-950">{SALON.name}</p>
        </div>
      </div>
    </section>
  );
}
