import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  CheckCircle,
  Star,
  User,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AddReview from "../../components/AddReview";
import ServiceCard from "../../components/ServiceCard";
import { formatCurrency } from "../../utils/formatDate";
import { useBookingCart } from "../../context/BookingCartContext";
import Navbar from "../../components/layout/Navbar";

import { fetchServiceBySlug } from "../../store/apps/user/userServices";
import { useDispatch, useSelector } from "react-redux";

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addService } = useBookingCart();
  const dispatch = useDispatch();

  const serviceStore = useSelector(
    (state) => state.userServices.selectedService,
  );

  const service = serviceStore?.service || null;

  const relatedServices = Array.isArray(serviceStore?.related_services)
    ? serviceStore.related_services
    : [];

  const reviews = Array.isArray(serviceStore?.reviews)
    ? serviceStore.reviews
    : [];

  const staffs = Array.isArray(serviceStore?.staffs) ? serviceStore.staffs : [];

  const images = Array.isArray(service?.images) ? service.images : [];

  const [showReview, setShowReview] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (slug) {
      dispatch(fetchServiceBySlug(slug));
    }
  }, [dispatch, slug]);

  // Reset image when service changes
  useEffect(() => {
    setCurrentImage(0);
  }, [slug]);

  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500">Loading service...</p>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }
  };

  const previousImage = () => {
    if (images.length > 0) {
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;

    // Adjust this depending on your API response
    return image.image_url || image.url || image.path;
  };

  const currentImageUrl = getImageUrl(images[currentImage]);

  const discountedPrice =
    Number(service.price) -
    (Number(service.price) * Number(service.discount || 0)) / 100;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {showReview && (
        <AddReview
          showReview={showReview}
          setShowReview={setShowReview}
          service={service}
        />
      )}

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Back */}
        <Link
          to="/services"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-gray-700 hover:text-black"
        >
          <ChevronLeft size={18} />
          Back To Services
        </Link>

        {/* ============================= */}
        {/* SERVICE DETAILS */}
        {/* ============================= */}

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image Slider */}
          <div>
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">
              {currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt={service.name}
                  className="h-[450px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[450px] items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Image thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {images.map((image, index) => {
                  const imageUrl = getImageUrl(image);

                  return (
                    <button
                      key={image.id || index}
                      onClick={() => setCurrentImage(index)}
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                        currentImage === index
                          ? "border-black"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`${service.name} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Service Information */}
          <div className="flex flex-col justify-center">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
                {service.category?.name}
              </span>

              {service.discount > 0 && (
                <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-600">
                  {service.discount}% OFF
                </span>
              )}
            </div>

            <h1 className="text-4xl font-black md:text-5xl">{service.name}</h1>

            {service.description && (
              <p className="mt-5 leading-7 text-gray-600">
                {service.description}
              </p>
            )}

            {/* Price */}
            <div className="mt-6">
              {Number(service.discount) > 0 ? (
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">
                    {formatCurrency(discountedPrice)}
                  </span>

                  <span className="text-xl text-gray-400 line-through">
                    {formatCurrency(service.price)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold">
                  {formatCurrency(service.price)}
                </span>
              )}
            </div>

            {/* Duration */}
            <div className="mt-4 flex items-center gap-2 text-gray-600">
              <Clock size={20} />
              <span>{service.duration_minutes} minutes</span>
            </div>

            {/* Book */}
            <button
              onClick={() => {
                addService(service.id);
                navigate("/book-appointment");
              }}
              className="mt-8 w-full rounded-xl bg-blue-600 px-10 py-4 font-bold text-white transition hover:bg-blue-700"
            >
              Book Now
            </button>

            {/* Features */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t pt-8">
              <div className="text-center">
                <Shield className="mx-auto mb-2" size={24} />
                <p className="text-sm font-medium">Warranty</p>
              </div>

              <div className="text-center">
                <Clock className="mx-auto mb-2" size={24} />
                <p className="text-sm font-medium">Fast Service</p>
              </div>

              <div className="text-center">
                <CheckCircle className="mx-auto mb-2" size={24} />
                <p className="text-sm font-medium">Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================= */}
        {/* STAFF */}
        {/* ============================= */}

        <section className="mt-20">
          <div className="mb-8">
            <h2 className="text-3xl font-black">Our Staff</h2>
            <p className="mt-2 text-gray-500">
              Professionals available for this service
            </p>
          </div>

          {staffs.length === 0 ? (
            <p className="text-gray-500">
              No staff available for this service.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {staffs.map((staff) => (
                <div
                  key={staff.id}
                  className="rounded-2xl border bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <User size={28} className="text-gray-500" />
                    </div>

                    <div>
                      <h3 className="font-bold">{staff.position}</h3>

                      <p className="text-sm text-gray-500">
                        {staff.experience} years experience
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <Star
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="font-semibold">{staff.avg_rating}</span>
                  </div>

                  {staff.bio && (
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {staff.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ============================= */}
        {/* REVIEWS */}
        {/* ============================= */}

        <section className="mt-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-black">Customer Reviews</h2>

              <p className="mt-2 text-gray-500">
                {reviews.length} approved review
                {reviews.length !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={() => setShowReview(true)}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Write Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="mt-8 rounded-2xl border p-10 text-center">
              <p className="text-gray-500">No reviews yet for this service.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border bg-white p-6 shadow-sm"
                >
                  {/* User */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">
                        {review.user?.name || "Anonymous"}
                      </h3>

                      <p className="text-sm text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={18}
                          className={
                            index < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="mt-5 leading-7 text-gray-600">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ============================= */}
        {/* RELATED SERVICES */}
        {/* ============================= */}

        <section className="mt-20">
          <div className="mb-8">
            <h2 className="text-3xl font-black">Related Services</h2>

            <p className="mt-2 text-gray-500">
              You may also be interested in these services.
            </p>
          </div>

          {relatedServices.length === 0 ? (
            <p className="text-gray-500">No related services found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((item) => (
                <ServiceCard key={item.id} service={item} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
