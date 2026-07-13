import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { SALON, STAFF } from "../../utils/constants";
import StaffCard from "../../components/StaffCard";

export default function About() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-rose-600">About</p>
            <h1 className="mt-2 text-4xl font-black text-stone-950">A calm salon workflow for clients and staff</h1>
            <p className="mt-4 leading-7 text-stone-600">
              {SALON.name} uses a simple appointment flow so clients can compare services, select the right specialist, and request an appointment without calling the front desk.
            </p>
          </div>
          <div className="grid gap-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-bold text-stone-950">Location</p>
              <p className="text-stone-600">{SALON.address}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-950">Opening hours</p>
              <p className="text-stone-600">{SALON.hours}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-950">Contact</p>
              <p className="text-stone-600">{SALON.phone}</p>
              <p className="text-stone-600">{SALON.email}</p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-black text-stone-950">Salon staff</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {STAFF.map((staff) => (
             <StaffCard key={staff.id} staff={staff} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
