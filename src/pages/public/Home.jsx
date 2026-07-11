import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import FAQ from "../../components/FAQ";
import { SALON, SERVICES, STAFF } from "../../utils/constants";
import ServiceCard from "../../components/ServiceCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-stone-950 text-white">
          <img
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="relative mx-auto grid min-h-[620px] max-w-7xl content-center gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-200">
                One salon, every appointment organized
              </p>
              <h1 className="mt-4 text-5xl font-black leading-tight sm:text-6xl">
                {SALON.name}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-100">
                {SALON.tagline}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/book">
                  <Button>Book an appointment</Button>
                </Link>
                <Link to="/services">
                  <Button variant="secondary">View services</Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-3 self-end rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-wide text-rose-100">
                Today at a glance
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-md bg-white/15 p-4">
                  <span className="block text-3xl font-black">
                    {SERVICES.length}
                  </span>
                  <span className="text-xs text-stone-200">Services</span>
                </div>
                <div className="rounded-md bg-white/15 p-4">
                  <span className="block text-3xl font-black">
                    {STAFF.length}
                  </span>
                  <span className="text-xs text-stone-200">Staff</span>
                </div>
                <div className="rounded-md bg-white/15 p-4">
                  <span className="block text-3xl font-black">7</span>
                  <span className="text-xs text-stone-200">Slots/day</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
                Popular services
              </p>
              <h2 className="mt-2 text-3xl font-black text-stone-950">
                Built for fast client booking
              </h2>
            </div>
            <Link to="/book">
              <Button variant="soft">Check availability</Button>
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {SERVICES.slice(0, 3).map((service) => (
              <ServiceCard service={service} />
            ))}
          </div>
        </section>
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
