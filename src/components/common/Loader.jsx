export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-stone-600">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-stone-200 border-t-rose-600" />
      <span>{label}</span>
    </div>
  );
}
