import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const DEFAULT_AVATAR = "/user.jpg";

const getItemsPerView = () => {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
};

function Testimonials({ testimonials, apiUrl }) {
  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());
  const [currentIndex, setCurrentIndex] = useState(0);

  // Responsive items
  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
      setCurrentIndex(0);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Maximum starting index
  const maxIndex = Math.max(testimonials.length - itemsPerView, 0);

  // Auto slide
  useEffect(() => {
    if (testimonials.length <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev >= maxIndex ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length, itemsPerView, maxIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev >= maxIndex ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev <= 0 ? maxIndex : prev - 1
    );
  };

  const getImageUrl = (image) => {
    if (!image) {
      return DEFAULT_AVATAR;
    }

    return `${apiUrl}/storage/${image}`;
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="mb-12 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
          Customer Reviews
        </p>

        <h2 className="mt-2 text-3xl font-black text-stone-950">
          What Our Clients Say
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${
                currentIndex * (100 / itemsPerView)
              }%)`,
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="shrink-0 px-3"
                style={{
                  width: `${100 / itemsPerView}%`,
                }}
              >
                <div className="h-full rounded-xl border border-stone-200 bg-white p-6 transition hover:shadow-lg">
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < testimonial.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-300"
                        }
                      />
                    ))}
                  </div>

                  {/* Message */}
                  <p className="mt-4 min-h-[90px] text-stone-700">
                    "{testimonial.message}"
                  </p>

                  {/* Customer */}
                  <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-4">
                    <img
                      src={getImageUrl(testimonial.image)}
                      alt={testimonial.name}
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }}
                      className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-rose-100"
                    />

                    <div>
                      <p className="font-semibold text-stone-900">
                        {testimonial.name}
                      </p>

                      <p className="text-sm text-stone-500">
                        Verified Customer
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Previous */}
        {testimonials.length > itemsPerView && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-0 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white shadow-md transition hover:bg-stone-50"
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-0 top-1/2 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white shadow-md transition hover:bg-stone-50"
              aria-label="Next testimonials"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {testimonials.length > itemsPerView && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-rose-600"
                  : "w-2 bg-stone-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Testimonials;