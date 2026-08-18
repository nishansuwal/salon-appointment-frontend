import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Clock,
  Scissors,
  Users,
  Calendar,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../../components/common/Button";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import FAQ from "../../components/FAQ";
import StaffCard from "../../components/StaffCard";

import { fetchActiveServices } from "../../store/apps/user/userServices";
import { useDispatch, useSelector } from "react-redux";

import {
  SALON,
  SERVICES,
  STAFF,
  SERVICE_CATEGORIES,
} from "../../utils/constants";
import ServiceCard from "../../components/ServiceCard";

export default function Home() {
  const dispatch = useDispatch();
  const serviceStore = useSelector((state) => state.userServices);
  console.log(serviceStore);

  useEffect(() => {
    dispatch(fetchActiveServices());
  }, [dispatch]);

  // Sample gallery images
  const galleryImages = [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
  ];

  // Sample reviews
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment:
        "Absolutely amazing service! The staff were professional and the results were incredible.",
      date: "2 weeks ago",
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      comment:
        "Best salon experience I've ever had. Highly recommend to anyone looking for quality service.",
      date: "1 month ago",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 4,
      comment:
        "Great atmosphere and talented stylists. Will definitely be coming back!",
      date: "3 weeks ago",
    },
  ];

  const steps = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Choose a Service",
      description: "Browse our services and select what you need",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Pick a Stylist",
      description: "Choose your preferred specialist",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Book a Time",
      description: "Select a convenient time slot",
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Confirm Booking",
      description: "Get instant confirmation",
    },
  ];

  const benefits = [
    {
      icon: <Scissors className="h-6 w-6" />,
      title: "Expert Stylists",
      description: "Professional and experienced staff",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Flexible Hours",
      description: "Book at your convenience",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Quality Products",
      description: "Premium products for best results",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Personalized Service",
      description: "Tailored to your needs",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main>
        {/* Hero Section */}
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
              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                {SALON.name}
              </h1>
              <p className="mt-5 max-w-2xl text-base sm:text-lg leading-8 text-stone-100">
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
                  <span className="block text-2xl sm:text-3xl font-black">
                    {SERVICES.length}
                  </span>
                  <span className="text-xs text-stone-200">Services</span>
                </div>
                <div className="rounded-md bg-white/15 p-4">
                  <span className="block text-2xl sm:text-3xl font-black">
                    {STAFF.length}
                  </span>
                  <span className="text-xs text-stone-200">Staff</span>
                </div>
                <div className="rounded-md bg-white/15 p-4">
                  <span className="block text-2xl sm:text-3xl font-black">
                    7
                  </span>
                  <span className="text-xs text-stone-200">Slots/day</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
              Why Choose Us
            </p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">
              The {SALON.name} Experience
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-xl border border-stone-200 bg-white p-6 text-center transition hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-stone-900">{benefit.title}</h3>
                <p className="mt-2 text-sm text-stone-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
                Categories
              </p>
              <h2 className="mt-2 text-3xl font-black text-stone-950">
                Browse by Category
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICE_CATEGORIES.map((category) => (
                <Link
                  key={category}
                  to={`/services?category=${category}`}
                  className="group relative overflow-hidden rounded-xl bg-stone-100 p-8 text-center transition hover:bg-rose-50"
                >
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-rose-700">
                    {category}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500">
                    {SERVICES.filter((s) => s.category === category).length}{" "}
                    services
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
                Featured Services
              </p>
              <h2 className="mt-2 text-3xl font-black text-stone-950">
                Popular Services
              </h2>
            </div>
            <Link to="/services">
              <Button variant="soft" className="flex items-center gap-2">
                View All
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.slice(0, 3).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* Meet Our Experts */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
                Meet Our Experts
              </p>
              <h2 className="mt-2 text-3xl font-black text-stone-950">
                Professional Stylists
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STAFF.map((staff) => (
                <StaffCard key={staff.id} staff={staff} />
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Preview */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
              Gallery Preview
            </p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">
              Our Work
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`overflow-hidden rounded-lg bg-stone-200 ${
                  index === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="h-full w-full object-cover transition hover:scale-105"
                  style={{ height: index === 0 ? "400px" : "190px" }}
                />
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/gallery">
              <Button variant="soft">View Full Gallery</Button>
            </Link>
          </div>
        </section>

        {/* How Booking Works */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
                How It Works
              </p>
              <h2 className="mt-2 text-3xl font-black text-stone-950">
                Book in 4 Easy Steps
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                    {step.icon}
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-stone-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
              Customer Reviews
            </p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-stone-200 bg-white p-6 transition hover:shadow-lg"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-stone-300"
                      }
                    />
                  ))}
                </div>
                <p className="mt-3 text-stone-700">{review.comment}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-stone-900">
                    {review.name}
                  </span>
                  <span className="text-sm text-stone-500">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <FAQ />

        {/* Book Appointment CTA */}
        <section className="bg-rose-600 py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-white">
              Ready to Look Your Best?
            </h2>
            <p className="mt-4 text-lg text-rose-100">
              Book your appointment today and experience premium service
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/book-appointment">
                <Button className="border-white bg-gray-800 text-rose-600 bg-white/10">
                  Book Now
                </Button>
              </Link>
              <Link to="/services">
                <Button
                  variant="secondary"
                  className="border-white bg-gray-800 text-white hover:bg-white/10"
                >
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
