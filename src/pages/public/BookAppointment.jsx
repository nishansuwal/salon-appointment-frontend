import { useMemo, useState, useEffect } from "react";
import { X, CalendarDays, Clock, MessageSquare, Scissors } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import { TIME_SLOTS } from "../../utils/constants";
import { useBookingCart } from "../../context/BookingCartContext";
import Navbar from "../../components/layout/Navbar";

import {
  formatCurrency,
  formatTime,
  todayInputValue,
} from "../../utils/formatDate";

import { fetchDropdownData } from "../../store/apps/public/dropdownSlice";
import { fetchAvailableStaff } from "../../store/apps/public/staffs";
import { addRecord as addAppointment } from "../../store/apps/public/appointment";

import {
  showConfirmAlert,
  showErrorAlert,
  showWarningAlert,
  showSuccessAlert,
} from "../../utils/alertUtils";

// Convert HH:mm into minutes
const toMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Add minutes to HH:mm
const addMinutesToTime = (time, minutes) => {
  const totalMinutes = toMinutes(time) + minutes;

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const closingMinutes = 19 * 60;

export default function BookAppointment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redux state
  const { dataByKey, loadingByKey } = useSelector((state) => state.dropdown);

  const { availableStaff = {}, availableStaffLoadingByService = {} } =
    useSelector((state) => state.staffs);

  // Booking cart
  const { cart, updateStaff, removeService } = useBookingCart();

  // Local state
  const [date, setDate] = useState(todayInputValue());
  const [time, setTime] = useState("");

  // Overall appointment notes
  const [appointmentNotes, setAppointmentNotes] = useState("");

  // Individual service notes
  const [serviceNotes, setServiceNotes] = useState({});

  // Booking submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Services fetched from API
  const services = dataByKey.bookingServices ?? [];

  // Fetch active services
  useEffect(() => {
    dispatch(
      fetchDropdownData({
        key: "bookingServices",
        module: "services",
        field: ["id", "name", "price", "duration_minutes"],
        filter: {
          status: "active",
        },
      }),
    );
  }, [dispatch]);

  // Match cart services with API services
  const selectedServices = useMemo(() => {
    return cart.services
      .map((cartItem) => {
        const service = services.find(
          (item) => Number(item.id) === Number(cartItem.serviceId),
        );

        if (!service) return null;

        return {
          ...service,
          id: Number(service.id),
          staffId: cartItem.staffId,
          duration: Number(service.duration_minutes),
          price: Number(service.price),
        };
      })
      .filter(Boolean);
  }, [cart.services, services]);

  // Calculate total duration
  const totalDuration = selectedServices.reduce(
    (total, service) => total + service.duration,
    0,
  );

  // Calculate total price
  const totalPrice = selectedServices.reduce(
    (total, service) => total + service.price,
    0,
  );

  // Calculate available time slots
  const availableSlots = TIME_SLOTS.filter((slot) => {
    return toMinutes(slot) + totalDuration <= closingMinutes;
  });

  // Reset selected time if no longer available
  useEffect(() => {
    if (time && !availableSlots.includes(time)) {
      setTime("");
    }
  }, [availableSlots, time]);

  // ==========================================
  // FETCH STAFF FOR EACH SERVICE
  // ==========================================

  const staffFetchKey = JSON.stringify({
    date,
    time,
    services: selectedServices.map((service) => ({
      serviceId: service.id,
      duration: service.duration,
    })),
  });

  useEffect(() => {
    const requestData = JSON.parse(staffFetchKey);

    const {
      date: requestDate,
      time: requestTime,
      services: requestServices,
    } = requestData;

    if (!requestDate || !requestTime || requestServices.length === 0) {
      return;
    }

    let previousDuration = 0;

    requestServices.forEach((service) => {
      const serviceStartTime = addMinutesToTime(requestTime, previousDuration);

      dispatch(
        fetchAvailableStaff({
          serviceId: service.serviceId,
          date: requestDate,
          start_time: serviceStartTime,
        }),
      );

      previousDuration += Number(service.duration);
    });
  }, [staffFetchKey, dispatch]);

  // Check staff selection
  const allStaffSelected = selectedServices.every(
    (service) =>
      service.staffId !== null &&
      service.staffId !== undefined &&
      service.staffId !== "",
  );

  // Check staff loading
  const staffLoading = selectedServices.some((service) =>
    Boolean(availableStaffLoadingByService[service.id]),
  );

  const servicesLoading = Boolean(loadingByKey.bookingServices);
  const isLoading = servicesLoading || staffLoading;

  // ==========================================
  // HANDLERS
  // ==========================================

  // Change appointment date
  const handleDateChange = (e) => {
    setDate(e.target.value);
    setTime("");

    selectedServices.forEach((service) => {
      updateStaff(service.id, null);
    });
  };

  // Change appointment time
  const handleTimeChange = (slot) => {
    setTime(slot);

    selectedServices.forEach((service) => {
      updateStaff(service.id, null);
    });
  };

  // Update individual service notes
  const handleServiceNotesChange = (serviceId, value) => {
    setServiceNotes((prev) => ({
      ...prev,
      [serviceId]: value,
    }));
  };

  // Remove service
  const handleRemoveService = (serviceId) => {
    removeService(serviceId);

    setServiceNotes((prev) => {
      const updated = { ...prev };
      delete updated[serviceId];
      return updated;
    });
  };

  // ==========================================
  // BOOKING VALIDATION
  // ==========================================

  const validateBooking = () => {
    if (selectedServices.length === 0) {
      showWarningAlert(
        "No Services Selected",
        "Please select at least one service before booking.",
      );
      return false;
    }

    if (!date || !time) {
      showWarningAlert(
        "Missing Appointment Details",
        "Please select your appointment date and time.",
      );
      return false;
    }

    if (staffLoading) {
      showWarningAlert(
        "Please Wait",
        "Available staff information is still loading.",
      );
      return false;
    }

    if (!allStaffSelected) {
      showWarningAlert(
        "Staff Not Selected",
        "Please select a staff member for every service.",
      );
      return false;
    }

    // Validate staff against the latest available staff list
    const invalidStaff = selectedServices.some((service) => {
      const staffList = availableStaff[service.id] ?? [];

      return !staffList.some(
        (staff) => Number(staff.id) === Number(service.staffId),
      );
    });

    if (invalidStaff) {
      showWarningAlert(
        "Staff Unavailable",
        "Some selected staff members are no longer available. Please select again.",
      );
      return false;
    }

    return true;
  };

  // ==========================================
  // SUBMIT BOOKING
  // ==========================================

  const confirmBooking = () => {
    if (!user) {
      showWarningAlert(
        "Login Required",
        "Please login to book an appointment.",
      );

      navigate("/login", {
        state: {
          from: "/book-appointment",
        },
      });

      return;
    }

    if (isSubmitting) return;

    if (!validateBooking()) return;

    // Prepare backend payload
    const payload = {
      appointment_date: date,
      start_time: time,

      // Overall appointment notes
      notes: appointmentNotes.trim() || null,

      // Individual service details and notes
      appointment_services: selectedServices.map((service) => ({
        service_id: service.id,
        staff_id: Number(service.staffId),
        notes: serviceNotes[service.id]?.trim() || null,
      })),
    };

    showConfirmAlert(
      "Confirm Appointment?",
      `You are booking ${selectedServices.length} service(s) for ${date} at ${formatTime(time)}. Total: ${formatCurrency(totalPrice)}.`,
      "Yes, Book Appointment",
      async () => {
        try {
          setIsSubmitting(true);

          const response = await dispatch(addAppointment(payload)).unwrap();

          showSuccessAlert(
            "Appointment Booked!",
            response?.message ||
              "Your appointment has been booked successfully.",
          );

          // Reset notes and selected date/time
          setAppointmentNotes("");
          setServiceNotes({});
          setDate(todayInputValue());
          setTime("");

          // The cart should be cleared here if your context
          // exposes a clearCart() function.
        } catch (error) {
          console.error("Appointment booking failed:", error);

          const message =
            error?.response?.data?.message ||
            error?.message ||
            (typeof error === "string" ? error : null) ||
            "Something went wrong while booking your appointment.";

          showErrorAlert("Booking Failed", message);
        } finally {
          setIsSubmitting(false);
        }
      },
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 mb-2">
            YOUR APPOINTMENT
          </p>

          <h1 className="text-3xl font-black text-gray-900">
            Book Appointment
          </h1>

          <p className="text-gray-500 mt-2">
            Choose your preferred date, time and staff member.
          </p>
        </div>

        {isLoading && (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-4 mb-6 flex items-center gap-3">
            <span className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
            Loading services or available staff...
          </div>
        )}

        {/* 1. DATE SELECTION */}
        <section className="bg-white border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <CalendarDays className="text-blue-600" size={22} />
            <h2 className="text-xl font-bold">1. Select Appointment Date</h2>
          </div>

          <input
            type="date"
            min={todayInputValue()}
            value={date}
            onChange={handleDateChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </section>

        {/* 2. TIME SELECTION */}
        <section className="bg-white border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <Clock className="text-blue-600" size={22} />
            <h2 className="text-xl font-bold">2. Select Appointment Time</h2>
          </div>

          {totalDuration === 0 ? (
            <p className="text-gray-500">Please select services first.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availableSlots.map((slot) => (
                <label
                  key={slot}
                  className={`
                    border p-3 rounded-lg text-center cursor-pointer transition
                    ${
                      time === slot
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:border-blue-500"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="appointmentTime"
                    className="hidden"
                    value={slot}
                    checked={time === slot}
                    onChange={() => handleTimeChange(slot)}
                  />

                  {formatTime(slot)}
                </label>
              ))}
            </div>
          )}
        </section>

        {/* 3. STAFF AND SERVICE NOTES */}
        <section className="bg-white border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <Scissors className="text-blue-600" size={22} />

            <h2 className="text-xl font-bold">3. Services & Staff Selection</h2>
          </div>

          {selectedServices.length === 0 && (
            <p className="text-gray-500">
              No services selected. Please add services first.
            </p>
          )}

          <div className="space-y-5">
            {selectedServices.map((service, index) => {
              const staffList = Array.isArray(availableStaff[service.id])
                ? availableStaff[service.id]
                : [];

              const staffLoadingForService = Boolean(
                availableStaffLoadingByService[service.id],
              );

              const previousDuration = selectedServices
                .slice(0, index)
                .reduce((total, item) => total + item.duration, 0);

              const serviceStartTime = time
                ? addMinutesToTime(time, previousDuration)
                : null;

              return (
                <div
                  key={service.id}
                  className="border border-gray-200 rounded-xl p-5"
                >
                  {/* SERVICE HEADER */}
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {index + 1}. {service.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {service.duration} minutes
                        {" · "}
                        {formatCurrency(service.price)}
                      </p>

                      {serviceStartTime && (
                        <p className="text-sm text-blue-600 mt-2">
                          Starts at: {formatTime(serviceStartTime)}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveService(service.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                      aria-label="Remove service"
                    >
                      <X size={19} />
                    </button>
                  </div>

                  {/* STAFF DROPDOWN */}
                  <div className="mt-5">
                    <label className="block text-sm font-semibold mb-2">
                      Select Staff
                    </label>

                    <select
                      className="border border-gray-300 p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={service.staffId ?? ""}
                      disabled={
                        !date ||
                        !time ||
                        staffLoadingForService ||
                        staffList.length === 0
                      }
                      onChange={(e) =>
                        updateStaff(
                          service.id,
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                    >
                      <option value="">
                        {!date || !time
                          ? "Select date and time first"
                          : staffLoadingForService
                            ? "Loading available staff..."
                            : staffList.length === 0
                              ? "No available staff"
                              : "Select Staff"}
                      </option>

                      {staffList.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.user?.name ||
                            staff.name ||
                            `Staff #${staff.id}`}
                          {" - "}
                          {staff.position}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* INDIVIDUAL SERVICE NOTES */}
                  <div className="mt-5">
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <MessageSquare size={17} className="text-blue-600" />
                      Instructions for {service.name}
                    </label>

                    <textarea
                      rows={3}
                      maxLength={1000}
                      value={serviceNotes[service.id] ?? ""}
                      onChange={(e) =>
                        handleServiceNotesChange(service.id, e.target.value)
                      }
                      placeholder={`Any special instructions for ${service.name}? (Optional)`}
                      className="border border-gray-300 rounded-lg p-3 w-full resize-none outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <p className="text-xs text-gray-400 text-right mt-1">
                      {(serviceNotes[service.id] ?? "").length}/1000
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. OVERALL APPOINTMENT NOTES */}
        <section className="bg-white border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="text-blue-600" size={22} />

            <h2 className="text-xl font-bold">4. Additional Instructions</h2>
          </div>

          <p className="text-sm text-gray-500 mb-3">
            Have any general requests for your appointment? Write them here.
          </p>

          <textarea
            rows={4}
            maxLength={2000}
            value={appointmentNotes}
            onChange={(e) => setAppointmentNotes(e.target.value)}
            placeholder="Write your overall appointment instructions here... (Optional)"
            className="border border-gray-300 rounded-lg p-3 w-full resize-none outline-none focus:ring-2 focus:ring-blue-500"
          />

          <p className="text-xs text-gray-400 text-right mt-1">
            {appointmentNotes.length}/2000
          </p>
        </section>

        {/* 5. BOOKING SUMMARY */}
        <section className="bg-white border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-5">5. Booking Summary</h2>

          <div className="space-y-3 text-gray-600">
            <div className="flex justify-between">
              <span>Total Services</span>
              <span className="font-semibold text-gray-900">
                {selectedServices.length}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Duration</span>
              <span className="font-semibold text-gray-900">
                {totalDuration} minutes
              </span>
            </div>

            <div className="flex justify-between">
              <span>Appointment Date</span>
              <span className="font-semibold text-gray-900">{date || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span>Appointment Time</span>
              <span className="font-semibold text-gray-900">
                {time ? formatTime(time) : "-"}
              </span>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">
                Total Price
              </span>

              <span className="text-2xl font-black text-blue-600">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>
        </section>

        {/* CONFIRM BOOKING */}
        <button
          type="button"
          onClick={confirmBooking}
          disabled={
            isLoading ||
            isSubmitting ||
            selectedServices.length === 0 ||
            !date ||
            !time ||
            !allStaffSelected
          }
          className="
            bg-blue-600 text-white px-6 py-4
            rounded-xl w-full font-bold text-lg
            hover:bg-blue-700 transition
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? "Booking Appointment..." : "Confirm Appointment"}
        </button>
      </div>
    </div>
  );
}
