import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Button from "../../components/common/Button";
import { SERVICE_CATEGORIES, SERVICES, STAFF } from "../../utils/constants";
import ServiceCard from "../../components/ServiceCard";

export default function Services() {
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(null);

  const filtered =
    category === "All"
      ? SERVICES
      : SERVICES.filter((service) => service.category === category);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
            Services
          </p>
          <h1 className="mt-2 text-4xl font-black text-stone-950">
            Choose a service, then pick your specialist
          </h1>
          <p className="mt-3 text-stone-600">
            Each salon service is connected to the staff trained to provide it.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* LEFT FILTER */}
          <aside className="rounded-lg border border-stone-200 bg-white p-5 h-fit sticky top-24">
            {/* Category Filter */}
            <div>
              <h3 className="mb-3 font-black text-stone-900">Categories</h3>
              <div className="space-y-2">
                {SERVICE_CATEGORIES.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={category === item}
                      onChange={() => setCategory(item)}
                      className="accent-stone-900"
                    />
                    <span className="text-sm font-semibold text-stone-700">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mt-6">
              <h3 className="mb-3 font-black text-stone-900">Price Range</h3>

              <div className="flex gap-3">
                {/* Min Price */}
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice ?? ""}
                  onChange={(e) => setMinPrice(Number(e.target.value) || null)}
                  className="w-1/2 rounded-md border px-3 py-2 text-sm"
                />

                {/* Max Price (OPTIONAL) */}
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice ?? ""}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  className="w-1/2 rounded-md border px-3 py-2 text-sm"
                />
              </div>
            </div>
          </aside>

          {/* RIGHT SERVICES */}
          <div className="grid gap-5 md:grid-cols-2">
            {filtered.map((service) => {
              const serviceStaff = STAFF.filter((member) =>
                service.staffIds.includes(member.id),
              );

              return <ServiceCard service={service} />;
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
