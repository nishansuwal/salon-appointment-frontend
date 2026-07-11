import clsx from "clsx";

export default function Input({ label, helper, className, id, ...props }) {
  const inputId = id || props.name;

  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-semibold text-stone-800">{label}</span>
      )}
      <input
        id={inputId}
        className={clsx(
          "min-h-11 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100",
          className,
        )}
        {...props}
      />
      {helper && <span className="mt-1 block text-xs text-stone-500">{helper}</span>}
    </label>
  );
}
