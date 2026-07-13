import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Button from "../../components/common/Button";
import { SERVICE_CATEGORIES, SERVICES, STAFF } from "../../utils/constants";
import ServiceCard from "../../components/ServiceCard";
import { Filter, X } from "lucide-react";

export default function Services() {
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filtered =
    category === "All"
      ? SERVICES
      : SERVICES.filter((service) => service.category === category);

  // Apply price filter
  const priceFiltered = filtered.filter((service) => {
    const price = service.price;
    const min = minPrice || 0;
    const max = maxPrice || Infinity;
    return price >= min && price <= max;
  });

  // Prevent body scroll when mobile filter is open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileFilterOpen]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 sm:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
            Services
          </p>
          <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-stone-950">
            Choose a service, then pick your specialist
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-stone-600">
            Each salon service is connected to the staff trained to provide it.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <Button
            onClick={() => setMobileFilterOpen(true)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Filter size={18} />
            Filter Services
            <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {priceFiltered.length}
            </span>
          </Button>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[260px_1fr]">
          {/* Desktop Filters */}
          <aside className="hidden lg:block">
            <div className="rounded-lg border border-stone-200 bg-white p-5 sticky top-24">
              <FilterContent
                category={category}
                setCategory={setCategory}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
              />
            </div>
          </aside>

          {/* Mobile Filter Overlay */}
          {mobileFilterOpen && (
            <>
              <div
                className="fixed inset-0 z-50 bg-black/40 lg:hidden"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] rounded-t-2xl bg-white shadow-2xl lg:hidden animate-slide-up">
                <div className="flex items-center justify-between border-b border-stone-200 p-4">
                  <h2 className="text-lg font-black text-stone-900">Filters</h2>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="rounded-full p-2 hover:bg-stone-100 transition"
                    aria-label="Close filters"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="overflow-y-auto p-4 pb-6">
                  <FilterContent
                    category={category}
                    setCategory={setCategory}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    onApply={() => setMobileFilterOpen(false)}
                    isMobile
                  />
                </div>
              </div>
            </>
          )}

          {/* Right Services Grid */}
          <div>
            {/* Results Count */}
            <p className="mb-4 text-sm text-stone-500">
              Showing {priceFiltered.length} service{priceFiltered.length !== 1 ? "s" : ""}
            </p>

            {priceFiltered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-200 bg-white p-12 text-center">
                <p className="text-lg font-semibold text-stone-700">
                  No services found
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  Try adjusting your filters
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => {
                    setCategory("All");
                    setMinPrice(1);
                    setMaxPrice(null);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">
                {priceFiltered.map((service) => {
                  const serviceStaff = STAFF.filter((member) =>
                    service.staffIds.includes(member.id),
                  );

                  return (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      staff={serviceStaff}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Filter Content Component (reused for both desktop and mobile)
function FilterContent({
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onApply,
  isMobile = false,
}) {
  return (
    <div>
      {/* Category Filter */}
      <div>
        <h3 className="mb-3 font-black text-stone-900">Categories</h3>
        <div className="space-y-2">
          {SERVICE_CATEGORIES.map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                checked={category === item}
                onChange={() => setCategory(item)}
                className="accent-stone-900 w-4 h-4 cursor-pointer"
              />
              <span
                className={`text-sm font-semibold transition ${
                  category === item
                    ? "text-stone-900"
                    : "text-stone-600 group-hover:text-stone-900"
                }`}
              >
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
          <div className="flex-1">
            <label className="text-xs font-medium text-stone-500">Min ($)</label>
            <input
              type="number"
              placeholder="0"
              min="0"
              value={minPrice ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setMinPrice(value === "" ? null : Number(value));
              }}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
          </div>

          <div className="flex-1">
            <label className="text-xs font-medium text-stone-500">Max ($)</label>
            <input
              type="number"
              placeholder="Any"
              min="0"
              value={maxPrice ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setMaxPrice(value === "" ? null : Number(value));
              }}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
          </div>
        </div>
      </div>

      {/* Apply Button for Mobile */}
      {isMobile && onApply && (
        <div className="mt-6">
          <Button onClick={onApply} className="w-full">
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
}