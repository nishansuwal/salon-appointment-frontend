import { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import FaqForm from "../../components/forms/FaqForm";
import LargeModal from "../../components/common/LargeModal";
import { getStatusColor } from "../../utils/getStatusColor";

const faqs = [
  {
    id: 1,
    question: "How do I book an appointment?",
    answer:
      "Select your preferred service, choose a date and time, select a staff member, and confirm your booking.",
    status: "Active",
  },
  {
    id: 2,
    question: "Can I cancel my appointment?",
    answer:
      "Yes. You can cancel your appointment before the scheduled time from your account dashboard.",
    status: "Active",
  },
  {
    id: 3,
    question: "Which payment methods are accepted?",
    answer: "We accept Cash, eSewa, Khalti and other online payment methods.",
    status: "Inactive",
  },
  {
    id: 4,
    question: "Can I choose my preferred staff?",
    answer: "Yes. During booking you can choose any available staff member.",
    status: "Active",
  },
];

export default function AdminFaq() {
  const [openId, setOpenId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  return (
    <section className="space-y-6">
      <LargeModal
        open={openForm}
        title={selectedFaq ? "Edit FAQ" : "Add FAQ"}
        onClose={() => setOpenForm(false)}
      >
        <FaqForm faq={selectedFaq} />
      </LargeModal>
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-black text-stone-900">
            Frequently Asked Questions
          </h1>

          <p className="mt-2 text-stone-500">
            Manage all frequently asked questions.
          </p>
        </div>

        <button
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white hover:bg-rose-700"
          onClick={() => {
            setSelectedFaq(null);
            setOpenForm(true);
          }}
        >
          <FiPlus />
          Add FAQ
        </button>
      </div>

      {/* Search */}

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

            <input
              type="text"
              placeholder="Search FAQ..."
              className="w-full rounded-lg border border-stone-300 py-3 pl-11 pr-4 outline-none focus:border-rose-500"
            />
          </div>

          <select className="rounded-lg border border-stone-300 px-4 py-3">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* FAQ Cards */}

      <div className="space-y-4">
        {faqs.map((faq) => {
          const open = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenId(open ? null : faq.id)}
                className="flex w-full items-center justify-between px-6 py-5 text-left hover:bg-stone-50"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        faq.status,
                      )}`}
                    >
                      {faq.status}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-stone-900">
                    {faq.question}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  {open ? (
                    <FiChevronUp size={22} />
                  ) : (
                    <FiChevronDown size={22} />
                  )}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      className="rounded-lg bg-amber-50 p-3 text-amber-600 hover:bg-amber-100"
                      onClick={() => {
                        setSelectedFaq(faq);
                        setOpenForm(true);
                      }}
                    >
                      <FiEdit2 />
                    </button>

                    <button className="rounded-lg bg-red-50 p-3 text-red-600 hover:bg-red-100">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </button>

              {open && (
                <div className="border-t border-stone-200 px-6 py-5">
                  <p className="leading-7 text-stone-600">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
