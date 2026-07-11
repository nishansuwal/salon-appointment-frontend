import { FiX } from "react-icons/fi";

export default function LargeModal({
  open,
  title,
  children,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
      <div className="mx-auto flex min-h-full items-center justify-center">

        <div className="w-full max-w-6xl rounded-2xl bg-stone-50 shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 bg-white px-8 py-5">

            <div>
              <h2 className="text-2xl font-bold text-stone-900">
                {title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 transition hover:bg-stone-100"
            >
              <FiX size={24} />
            </button>

          </div>

          {/* Body */}
          <div className="max-h-[85vh] overflow-y-auto p-8">
            {children}
          </div>

        </div>

      </div>
    </div>
  );
}