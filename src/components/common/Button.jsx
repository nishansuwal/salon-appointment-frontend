import clsx from "clsx";

const variants = {
  primary: "bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus:ring-rose-200",
  secondary: "bg-white text-stone-900 ring-1 ring-stone-200 hover:bg-stone-50 focus:ring-stone-200",
  soft: "bg-rose-50 text-rose-700 hover:bg-rose-100 focus:ring-rose-100",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200",
  ghost: "bg-transparent text-stone-700 hover:bg-stone-100 focus:ring-stone-200",
};

export default function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
