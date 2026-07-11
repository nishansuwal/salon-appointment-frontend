import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { SERVICES, TIME_SLOTS } from "../../utils/constants";
import { useBookingCart } from "../../context/BookingCartContext";
import Navbar from "../../components/layout/Navbar";
import {
  formatCurrency,
  formatTime,
  todayInputValue,
} from "../../utils/formatDate";

const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const closingMinutes = 19 * 60;

export default function BookAppointment() {
  const { cart, updateStaff, removeService, clearCart } = useBookingCart();

  const [date, setDate] = useState(todayInputValue());
  const [time, setTime] = useState("");

  // services from cart
  const selectedServices = useMemo(() => {
    return cart.services
      .map((c) => {
        const service = SERVICES.find((s) => s.id === c.serviceId);
        return service ? { ...service, staffId: c.staffId } : null;
      })
      .filter(Boolean);
  }, [cart.services]);

  const totalDuration = selectedServices.reduce((t, s) => t + s.duration, 0);
  const totalPrice = selectedServices.reduce((t, s) => t + s.price, 0);

  // available time slots that fit ALL services duration
  const availableSlots = TIME_SLOTS.filter((slot) => {
    const start = toMinutes(slot);
    return start + totalDuration <= closingMinutes;
  });

  const allStaffSelected = selectedServices.every((s) => s.staffId);

  const confirmBooking = () => {
    if (!allStaffSelected || !time) {
      alert("Please select staff for all services and a time slot");
      return;
    }

    const payload = {
      date,
      time,
      services: selectedServices.map((s) => ({
        serviceId: s.id,
        staffId: s.staffId,
        duration: s.duration,
        price: s.price,
      })),
      totalDuration,
      totalPrice,
    };

    console.log("BOOKING DATA", payload);

    alert("Appointment booked successfully!");
    clearCart();
  };

  return (
    <div className="min-h-screen bg-white p-10">
      <Navbar />
      <h1 className="text-3xl font-black mb-6">Book Appointment</h1>

      {/* Selected Services */}
      {selectedServices.map((s) => (
        <div key={s.id} className="border p-4 mb-4 rounded">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">{s.name}</h3>
            <button onClick={() => removeService(s.id)}>
              <X size={16} />
            </button>
          </div>

          <p className="text-sm">
            {s.duration} min — {formatCurrency(s.price)}
          </p>

          {/* Staff per service */}
          <select
            className="border p-2 w-full mt-3"
            value={s.staffId || ""}
            onChange={(e) => updateStaff(s.id, e.target.value)}
          >
            <option value="">Select Staff</option>
            {s.staffIds.map((staffId) => (
              <option key={staffId} value={staffId}>
                {staffId}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Date */}
      <input
        type="date"
        min={todayInputValue()}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 w-full mb-6"
      />

      {/* Time slots */}
      <div className="grid grid-cols-3 gap-3">
        {availableSlots.map((slot) => (
          <label
            key={slot}
            className={`border p-2 rounded text-center cursor-pointer ${
              time === slot ? "bg-blue-600 text-white" : ""
            }`}
          >
            <input
              type="radio"
              className="hidden"
              value={slot}
              checked={time === slot}
              onChange={() => setTime(slot)}
            />
            {formatTime(slot)}
          </label>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 font-bold">
        Total: {totalDuration} min — {formatCurrency(totalPrice)}
      </div>

      <button
        onClick={confirmBooking}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded"
      >
        Confirm Booking
      </button>
    </div>
  );
}
