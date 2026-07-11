import clsx from "clsx";

const styles = {
  Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Pending: "bg-amber-50 text-amber-700 ring-amber-100",
  Cancelled: "bg-red-50 text-red-700 ring-red-100",
  Completed: "bg-sky-50 text-sky-700 ring-sky-100",
};

export default function AppointmentStatus({ status }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1",
        styles[status] || "bg-stone-100 text-stone-700 ring-stone-200",
      )}
    >
      {status}
    </span>
  );
}
