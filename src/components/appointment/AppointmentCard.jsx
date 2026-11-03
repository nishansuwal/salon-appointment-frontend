import {
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
  Clock,
  Scissors,
  User,
} from "lucide-react";

import AppointmentStatus from "./AppointmentStatus";
import { formatCurrency, formatDate, formatTime } from "../../utils/formatDate";

export default function AppointmentCard({
  appointment,
  compact = false,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  // --------------------------------------
  // APPOINTMENT DATA
  // --------------------------------------

  const services =
    appointment.appointment_services ?? appointment.services ?? [];

  const customer = appointment.user ?? appointment.customer;

  const customerName =
    customer?.name ?? appointment.customerName ?? "Unknown Customer";

  const customerEmail = customer?.email ?? "No email available";

  const appointmentCode =
    appointment.appointment_code ?? `APT-${appointment.id}`;

  const appointmentDate = appointment.appointment_date ?? appointment.date;

  const startTime = appointment.start_time ?? appointment.time;

  const endTime = appointment.end_time ?? appointment.endTime;

  const status = appointment.status?.toLowerCase() ?? "pending";

  // --------------------------------------
  // SERVICE INFORMATION
  // --------------------------------------

  const serviceNames = services.map((item) => {
    return item.service?.name ?? item.name ?? `Service #${item.service_id}`;
  });

  const totalDuration = services.reduce(
    (total, item) =>
      total +
      Number(
        item.duration_minutes ??
          item.service?.duration_minutes ??
          item.duration ??
          0,
      ),
    0,
  );

  const totalPrice = Number(appointment.total ?? appointment.totalPrice ?? 0);

  // Staff can be different for each service
  const staffNames = [
    ...new Set(
      services
        .map(
          (item) =>
            item.staff?.user?.name ??
            item.staff?.name ??
            item.staff?.position ??
            (item.staff_id ? `Staff #${item.staff_id}` : null),
        )
        .filter(Boolean),
    ),
  ];

  // --------------------------------------
  // HELPERS
  // --------------------------------------

  const displayDate = (date) => {
    if (!date) return "-";

    return formatDate(date);
  };

  const displayTime = (time) => {
    if (!time) return "-";

    return formatTime(time);
  };

  return (
    <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-rose-200 hover:shadow-md">
      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-rose-600">
            {appointmentCode}
          </p>

          <h3 className="mt-1 text-lg font-bold text-stone-950">
            {customerName}
          </h3>

          <p className="mt-1 text-sm text-stone-500">{customerEmail}</p>
        </div>

        <AppointmentStatus status={status} />
      </div>

      {/* -------------------------------- */}
      {/* APPOINTMENT INFORMATION */}
      {/* -------------------------------- */}

      <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <InfoItem
          icon={<CalendarDays size={17} />}
          label="Appointment Date"
          value={displayDate(appointmentDate)}
        />

        <InfoItem
          icon={<Clock size={17} />}
          label="Schedule"
          value={`${displayTime(startTime)}${
            endTime ? ` - ${displayTime(endTime)}` : ""
          }`}
        />

        <InfoItem
          icon={<Scissors size={17} />}
          label="Services"
          value={`${services.length} Service(s)`}
        />

        <InfoItem
          icon={<User size={17} />}
          label="Assigned Staff"
          value={staffNames.length ? staffNames.join(", ") : "Not assigned"}
        />
      </div>

      {/* -------------------------------- */}
      {/* SERVICE SUMMARY */}
      {/* -------------------------------- */}

      {!compact && (
        <div className="mt-5 border-t pt-4">
          <h4 className="mb-3 text-sm font-bold text-stone-800">
            Appointment Services
          </h4>

          <div className="space-y-2">
            {services.length > 0 ? (
              services.map((item, index) => {
                const service = item.service ?? item;

                const staffName =
                  item.staff?.user?.name ?? item.staff?.name ?? "Not assigned";

                return (
                  <div
                    key={item.id ?? item.service_id ?? index}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-stone-50 p-3"
                  >
                    <div>
                      <p className="font-semibold text-stone-800">
                        {service.name ?? "Unknown Service"}
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        Staff: {staffName}
                        {" · "}
                        {Number(
                          item.duration_minutes ??
                            service.duration_minutes ??
                            0,
                        )}{" "}
                        minutes
                      </p>

                      {item.notes && (
                        <p className="mt-2 text-xs text-stone-500">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>

                    <p className="font-bold text-stone-900">
                      {formatCurrency(Number(item.price ?? service.price ?? 0))}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-stone-400">No services available.</p>
            )}
          </div>

          {/* OVERALL NOTES */}
          {appointment.notes && (
            <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-3">
              <p className="text-xs font-bold uppercase text-amber-700">
                Appointment Notes
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm text-stone-700">
                {appointment.notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------- */}
      {/* FOOTER / PAYMENT */}
      {/* -------------------------------- */}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <div>
          <p className="text-xs font-semibold uppercase text-stone-400">
            Total Amount
          </p>

          <p className="mt-1 text-lg font-black text-stone-950">
            {formatCurrency(totalPrice)}
          </p>

          {!compact && (
            <p className="text-xs text-stone-500">
              Total Duration: {totalDuration} minutes
            </p>
          )}
        </div>

        {/* ADMIN ACTIONS */}

        {(onView || onEdit || onDelete || onStatusChange) && (
          <div className="flex flex-wrap items-center gap-2">
            {onView && (
              <ActionButton
                onClick={() => onView(appointment)}
                icon={<Eye size={16} />}
              >
                View
              </ActionButton>
            )}

            {onEdit && (
              <ActionButton
                onClick={() => onEdit(appointment)}
                icon={<Pencil size={16} />}
              >
                Edit
              </ActionButton>
            )}

            {onDelete && (
              <ActionButton
                onClick={() => onDelete(appointment)}
                danger
                icon={<Trash2 size={16} />}
              >
                Delete
              </ActionButton>
            )}
          </div>
        )}
      </div>

      {/* STATUS ACTION */}

      {onStatusChange && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <label className="text-sm font-semibold text-stone-600">
            Update Status
          </label>

          <select
            value={status}
            onChange={(e) => onStatusChange(appointment.id, e.target.value)}
            className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold outline-none focus:border-rose-500"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>
      )}
    </article>
  );
}

// ==========================================
// INFORMATION ITEM
// ==========================================

function InfoItem({ icon, label, value }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2 text-stone-400">
        {icon}
        <span className="text-xs font-semibold uppercase">{label}</span>
      </div>

      <p className="break-words font-medium text-stone-800">{value || "-"}</p>
    </div>
  );
}

// ==========================================
// ACTION BUTTON
// ==========================================

function ActionButton({ children, icon, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-stone-200 text-stone-700 hover:bg-stone-50"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
