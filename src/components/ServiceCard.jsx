import React from "react";
import { formatCurrency } from "../utils/formatDate";
import { useBookingCart } from "../context/BookingCartContext";
import { Link, useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL_PUBLIC;

function ServiceCard({ service }) {
  const navigate = useNavigate();
  const { addService } = useBookingCart();

  const primaryImage = service.images?.find(
    (image) => image.is_primary === true,
  );

  const displayImage =
    primaryImage?.image_path || service.images?.[0]?.image_path || null;

  // =========================================================
  // Price Calculation
  // =========================================================
  const originalPrice = Number(service.price || 0);
  const discount = Number(service.discount || 0);

  const discountedPrice =
    discount > 0
      ? originalPrice - (originalPrice * discount) / 100
      : originalPrice;

  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      {/* =====================================================
          Image
      ===================================================== */}
      <Link to={`/service/${service.slug}`}>
        {displayImage ? (
          <img
            src={`${apiUrl}/storage/${displayImage}`}
            alt={service.name}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-stone-100 text-sm text-stone-400">
            No image
          </div>
        )}
      </Link>

      <div className="p-5">
        {/* ===================================================
            Category
        =================================================== */}
        <p className="text-xs font-bold uppercase text-rose-600">
          {service.category?.name}
        </p>

        {/* ===================================================
            Service Name
        =================================================== */}
        <Link to={`/service/${service.slug}`}>
          <h3 className="mt-2 text-xl font-black text-stone-950">
            {service.name}
          </h3>
        </Link>

        {/* ===================================================
            Description
        =================================================== */}
        <p className="mt-2 text-sm text-stone-600">
          {service.description?.split(" ").slice(0, 12).join(" ")}
          {service.description?.split(" ").length > 12 ? "..." : ""}
        </p>
        {/* ===================================================
            Price
        =================================================== */}
        <div className="mt-4">
          {discount > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {/* Discounted Price */}
              <span className="text-lg font-black text-stone-950">
                {formatCurrency(discountedPrice)}
              </span>

              {/* Original Price */}
              <span className="text-sm font-medium text-stone-400 line-through">
                {formatCurrency(originalPrice)}
              </span>

              {/* Discount */}
              <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-bold text-rose-600">
                {discount}% OFF
              </span>
            </div>
          ) : (
            <span className="text-lg font-black text-stone-950">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>

        {/* ===================================================
            Book Button
        =================================================== */}
        <button
          onClick={() => {
            addService(service.id);
            navigate("/book-appointment");
          }}
          className="mt-8 w-full rounded bg-blue-600 px-10 py-4 font-bold text-white transition hover:bg-blue-700"
        >
          Book Now
        </button>
      </div>
    </article>
  );
}

export default ServiceCard;
