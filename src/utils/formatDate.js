export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// export function formatDate(dateString) {
//   return new Intl.DateTimeFormat("en", {
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   }).format(new Date(`${dateString}T00:00:00`));
// }
export function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatTime(time) {
  const [hour, minute] = time.split(":").map(Number);
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2026, 0, 1, hour, minute));
}

export function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}
