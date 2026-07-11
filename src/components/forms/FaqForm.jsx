import { useState } from "react";

export default function FaqForm({ faq = null }) {
  const isEdit = Boolean(faq);

  const [status, setStatus] = useState(faq?.status === "Active" || !faq);

  return (
    <form className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Question
        </label>

        <input
          type="text"
          defaultValue={faq?.question}
          placeholder="How do I book an appointment?"
          className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-rose-500"
        />
      </div>

      {/* Answer */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Answer
        </label>

        <textarea
          rows={6}
          defaultValue={faq?.answer}
          placeholder="Write the answer here..."
          className="w-full rounded-lg border border-stone-300 p-4 outline-none transition focus:border-rose-500"
        />
      </div>

      {/* Sort Order + Status */}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Sort Order */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-stone-700">
            Sort Order
          </label>

          <input
            type="number"
            defaultValue={faq?.sortOrder ?? 1}
            className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-rose-500"
          />

          <p className="mt-2 text-xs text-stone-500">
            Smaller numbers appear first.
          </p>
        </div>

        {/* Status */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-stone-700">
            Status
          </label>

          <button
            type="button"
            onClick={() => setStatus(!status)}
            className={`relative flex h-8 w-16 items-center rounded-full transition ${
              status ? "bg-rose-600" : "bg-stone-300"
            }`}
          >
            <span
              className={`h-7 w-7 rounded-full bg-white shadow transition ${
                status ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>

          <p className="mt-2 text-sm text-stone-500">
            {status ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3 border-t border-stone-200 pt-6">
        <button
          type="submit"
          className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700"
        >
          {isEdit ? "Update FAQ" : "Save FAQ"}
        </button>
      </div>
    </form>
  );
}
