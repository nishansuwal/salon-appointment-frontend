import AppointmentStatus from "./AppointmentStatus";
import Button from "../common/Button";
import { formatCurrency, formatDate, formatTime } from "../../utils/formatDate";

export default function AppointmentCard({ appointment, compact = false, onCancel, onStatusChange }) {
  const { service, services = service ? [service] : [], staff } = appointment;
  const serviceNames = services.map((item) => item.name).join(", ");
  const totalDuration =
    appointment.totalDuration || services.reduce((total, item) => total + item.duration, 0);
  const totalPrice = appointment.totalPrice || services.reduce((total, item) => total + item.price, 0);

  return (
    <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-rose-600">
            {appointment.id}
          </p>
          <h3 className="mt-1 text-lg font-bold text-stone-950">{serviceNames}</h3>
          <p className="mt-1 text-sm text-stone-500">
            {formatDate(appointment.date)} at {formatTime(appointment.time)}
            {appointment.endTime ? ` - ${formatTime(appointment.endTime)}` : ""}
          </p>
        </div>
        <AppointmentStatus status={appointment.status} />
      </div>

      <div className="mt-4 grid gap-3 text-sm text-stone-700 sm:grid-cols-2">
        <div>
          <span className="block text-xs font-semibold uppercase text-stone-400">Client</span>
          {appointment.customerName}
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase text-stone-400">Staff</span>
          {staff?.name}
        </div>
        {!compact && (
          <>
            <div>
              <span className="block text-xs font-semibold uppercase text-stone-400">Duration</span>
              {totalDuration} minutes
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase text-stone-400">Price</span>
              {formatCurrency(totalPrice)}
            </div>
          </>
        )}
      </div>

      {appointment.notes && !compact && (
        <p className="mt-4 rounded-md bg-stone-50 p-3 text-sm text-stone-600">{appointment.notes}</p>
      )}

      {(onCancel || onStatusChange) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {onStatusChange && (
            <>
              <Button variant="soft" onClick={() => onStatusChange(appointment.id, "Confirmed")}>
                Confirm
              </Button>
              <Button variant="secondary" onClick={() => onStatusChange(appointment.id, "Completed")}>
                Complete
              </Button>
            </>
          )}
          {onCancel && appointment.status !== "Cancelled" && (
            <Button variant="danger" onClick={() => onCancel(appointment.id)}>
              Cancel
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
