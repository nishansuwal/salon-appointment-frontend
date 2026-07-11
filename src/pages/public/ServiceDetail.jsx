import { useState } from "react";
import { ChevronLeft, Shield, Clock, CheckCircle } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AddReview from "../../components/AddReview";
import ServiceCard from "../../components/ServiceCard";
import { SERVICES } from "../../utils/constants";
import { formatCurrency } from "../../utils/formatDate";
import { useBookingCart } from "../../context/BookingCartContext";
import Navbar from "../../components/layout/Navbar";

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addService } = useBookingCart();

  const service = SERVICES.find((item) => item.slug === slug);
  const [showReview, setShowReview] = useState(false);

  if (!service) return null;

  return (
    <div className="min-h-screen bg-white p-10">
      <Navbar />
      {showReview && (
        <AddReview showReview={showReview} setShowReview={setShowReview} />
      )}

      <Link to="/services" className="mb-10 flex items-center gap-2 font-bold">
        <ChevronLeft size={18} />
        Back To Services
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <img
            src={service.image}
            alt={service.name}
            className="h-[450px] w-full rounded object-cover"
          />
        </div>

        <div>
          <span className="bg-black px-4 py-2 text-sm text-white">
            {service.category}
          </span>

          <h1 className="mt-5 text-5xl font-black">{service.name}</h1>
          <p className="mt-5 text-3xl font-bold">
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

          <div className="mt-10 grid grid-cols-3">
            <div className="text-center">
              <Shield className="mx-auto" />
              <p>Warranty</p>
            </div>
            <div className="text-center">
              <Clock className="mx-auto" />
              <p>Fast</p>
            </div>
            <div className="text-center">
              <CheckCircle className="mx-auto" />
              <p>Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold">Reviews</h2>
        <button
          onClick={() => setShowReview(true)}
          className="mt-4 rounded bg-blue-600 p-2 text-white"
        >
          Write Review
        </button>
      </div>

      {/* Related Services */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold">Related Services</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {SERVICES.filter((item) => item.id !== service.id)
            .slice(0, 3)
            .map((item) => (
              <ServiceCard key={item.id} service={item} />
            ))}
        </div>
      </div>
    </div>
  );
}
