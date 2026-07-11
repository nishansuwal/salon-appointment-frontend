import React from "react";
import { formatCurrency } from "../utils/formatDate";
import { useBookingCart } from "../context/BookingCartContext";
import { Link, useParams, useNavigate } from "react-router-dom";

function ServiceCard({ service }) {
  const navigate = useNavigate();
  const { addService } = useBookingCart();

  return (
    <div>
      <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <Link to={`/service/${service.slug}`}>
          <img
            src={service.image}
            alt=""
            className="h-48 w-full object-cover"
          />
        </Link>
        <div className="p-5">
          <p className="text-xs font-bold uppercase text-rose-600">
            {service.category}
          </p>
          <Link to={`/service/${service.slug}`}>
            <h3 className="mt-2 text-xl font-black text-stone-950">
              {service.name}
            </h3>
          </Link>
          <p className="mt-2 text-sm text-stone-600">{service.description}</p>
          <p className="mt-4 font-bold text-stone-950">
            {formatCurrency(service.price)}
          </p>
          <button
            onClick={() => {
              addService(service.id);
              navigate("/book-appointment");
            }}
            className="mt-8 rounded bg-blue-600 px-10 py-4 font-bold text-white"
          >
            Book Now
          </button>
        </div>
      </article>
    </div>
  );
}

export default ServiceCard;
