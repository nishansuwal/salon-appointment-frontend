import Button from "./Button";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/50 px-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-stone-950">{title}</h2>
          <Button
            variant="ghost"
            className="h-10 w-10 px-0"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </Button>
        </div>

        {children}
      </div>
    </div>
  );
}
