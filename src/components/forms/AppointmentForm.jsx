import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Input from "../common/Input";
import useAuth from "../../hooks/useAuth";
import { useAppointmentContext } from "../../context/AppointmentContext";
import { TIME_SLOTS } from "../../utils/constants";
import { formatCurrency, todayInputValue } from "../../utils/formatDate";

export default function AppointmentForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { services, staff, createAppointment } = useAppointmentContext();
  const [form, setForm] = useState({
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    serviceId: services[0]?.id || "",
    staffId: "",
    date: todayInputValue(),
    time: TIME_SLOTS[0],
    notes: "",
  });

  const selectedService = services.find((service) => service.id === form.serviceId);
  const availableStaff = useMemo(
    () => staff.filter((member) => selectedService?.staffIds.includes(member.id)),
    [staff, selectedService],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === "serviceId") next.staffId = "";
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createAppointment({
      ...form,
      staffId: form.staffId || availableStaff[0]?.id,
    });
    navigate("/appointments");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Your name" name="customerName" value={form.customerName} onChange={handleChange} required />
        <Input label="Email" name="customerEmail" type="email" value={form.customerEmail} onChange={handleChange} required />
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-800">Service</span>
        <select
          name="serviceId"
          value={form.serviceId}
          onChange={handleChange}
          className="min-h-11 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - {service.duration} min - {formatCurrency(service.price)}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-3">
        <span className="text-sm font-semibold text-stone-800">Choose staff</span>
        <div className="grid gap-3 md:grid-cols-2">
          {availableStaff.map((member) => (
            <label
              key={member.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                (form.staffId || availableStaff[0]?.id) === member.id
                  ? "border-rose-500 bg-rose-50"
                  : "border-stone-200 bg-white hover:bg-stone-50"
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name="staffId"
                value={member.id}
                checked={(form.staffId || availableStaff[0]?.id) === member.id}
                onChange={handleChange}
              />
              <img src={member.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
              <span>
                <span className="block font-bold text-stone-950">{member.name}</span>
                <span className="text-sm text-stone-500">{member.role}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Date" name="date" type="date" min={todayInputValue()} value={form.date} onChange={handleChange} required />
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-800">Time</span>
          <select
            name="time"
            value={form.time}
            onChange={handleChange}
            className="min-h-11 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-800">Notes</span>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows="4"
          className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
          placeholder="Hair length, skin sensitivity, event type, or any preferences"
        />
      </label>

      <Button type="submit" className="w-full sm:w-auto">
        Request appointment
      </Button>
    </form>
  );
}
