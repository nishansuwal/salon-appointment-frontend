import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "../utils/faqs";

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-8 text-center text-3xl font-black">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {FAQS.map((faq) => (
          <div
            key={faq.id}
            className="rounded-lg border bg-white"
          >
            <button
              onClick={() => toggle(faq.id)}
              className="flex w-full items-center justify-between p-5 text-left font-semibold"
            >
              {faq.question}
              <ChevronDown
                className={`transition-transform ${
                  openId === faq.id ? "rotate-180" : ""
                }`}
              />
            </button>

            {openId === faq.id && (
              <div className="border-t px-5 pb-5 text-gray-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}