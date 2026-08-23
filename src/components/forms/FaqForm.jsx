import { useEffect, useState } from "react";

export default function FaqForm({ faq = null, onSubmit, onCancel }) {
  const isEdit = Boolean(faq);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    sort_order: 1,
    is_active: true,
  });

  // ==========================================
  // Load FAQ when editing
  // ==========================================
  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question ?? "",
        answer: faq.answer ?? "",
        sort_order: faq.sort_order ?? 1,
        is_active: Boolean(faq.is_active),
      });
    } else {
      // Reset form when adding
      setFormData({
        question: "",
        answer: "",
        sort_order: 1,
        is_active: true,
      });
    }
  }, [faq]);

  // ==========================================
  // Input change
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "sort_order"
          ? Number(value)
          : value,
    }));
  };

  // ==========================================
  // Status toggle
  // ==========================================
  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      is_active: !prev.is_active,
    }));
  };

  // ==========================================
  // Submit
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      sort_order: Number(formData.sort_order),
      is_active: Boolean(formData.is_active),
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ==========================================
          QUESTION
      ========================================== */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Question
        </label>

        <input
          type="text"
          name="question"
          value={formData.question}
          onChange={handleChange}
          placeholder="How do I book an appointment?"
          className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-rose-500"
          required
        />
      </div>

      {/* ==========================================
          ANSWER
      ========================================== */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Answer
        </label>

        <textarea
          name="answer"
          rows={6}
          value={formData.answer}
          onChange={handleChange}
          placeholder="Write the answer here..."
          className="w-full rounded-lg border border-stone-300 p-4 outline-none transition focus:border-rose-500"
          required
        />
      </div>

      {/* ==========================================
          SORT ORDER + STATUS
      ========================================== */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Sort Order */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-stone-700">
            Sort Order
          </label>

          <input
            type="number"
            name="sort_order"
            min="0"
            value={formData.sort_order}
            onChange={handleChange}
            className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-rose-500"
            required
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
            onClick={handleStatusToggle}
            className={`relative flex h-8 w-16 items-center rounded-full transition ${
              formData.is_active
                ? "bg-rose-600"
                : "bg-stone-300"
            }`}
          >
            <span
              className={`h-7 w-7 rounded-full bg-white shadow transition ${
                formData.is_active
                  ? "translate-x-8"
                  : "translate-x-1"
              }`}
            />
          </button>

          <p className="mt-2 text-sm text-stone-500">
            {formData.is_active
              ? "Active"
              : "Inactive"}
          </p>
        </div>
      </div>

      {/* ==========================================
          FOOTER
      ========================================== */}
      <div className="flex justify-end gap-3 border-t border-stone-200 pt-6">

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-stone-300 px-6 py-3 font-semibold text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
        )}

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