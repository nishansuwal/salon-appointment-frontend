import { useState } from "react";

export default function ReviewForm({ review, onClose }) {
  const [status, setStatus] = useState(review?.status || "Pending");

  return (
    <form className="space-y-6">
      {/* Header */}

      <div>
        <h2 className="text-2xl font-bold text-stone-900">Review Details</h2>

        <p className="mt-1 text-sm text-stone-500">Moderate customer review.</p>
      </div>

      {/* Customer */}

      <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-stone-500">
              Customer
            </p>

            <p className="mt-1 font-semibold text-stone-900">Ram Sharma</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-stone-500">
              Service
            </p>

            <p className="mt-1 font-semibold text-stone-900">Hair Cut</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-stone-500">
              Staff
            </p>

            <p className="mt-1 font-semibold text-stone-900">Sita Thapa</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-stone-500">
              Rating
            </p>

            <p className="mt-1 text-yellow-500 text-xl">★★★★★</p>
          </div>
        </div>
      </div>

      {/* Customer Review */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Customer Review
        </label>

        <textarea
          readOnly
          rows={5}
          defaultValue="Excellent service. Staff were friendly and professional."
          className="w-full rounded-lg border border-stone-300 bg-stone-100 p-4 text-stone-600"
        />
      </div>

      {/* Status */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Review Status
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-rose-500"
        >
          <option>Pending</option>
          <option>Approved</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Admin Note */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Admin Note
        </label>

        <textarea
          rows={5}
          placeholder="Internal note (not visible to customers)..."
          className="w-full rounded-lg border border-stone-300 p-4 outline-none focus:border-rose-500"
        />
      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3 border-t border-stone-200 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-stone-300 px-6 py-3 font-semibold hover:bg-stone-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white hover:bg-rose-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
