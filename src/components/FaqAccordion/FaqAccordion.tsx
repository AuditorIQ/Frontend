import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "How does AuditIQ ensure HIPAA compliance?",
    answer:
      "We process your uploaded charts securely and never store patient records after the audit is complete. Our system is built from the ground up to meet HIPAA standards.",
  },
  {
    question: "What happens if my MAC doesn’t have an applicable LCD?",
    answer: "We’ll notify you of any discrepancies and provide guidance accordingly.",
  },
  {
    question: "Can I audit charts for multiple providers?",
    answer: "Yes, you can audit charts across multiple providers within your account.",
  },
  {
    question: "What if I only upload one date of service?",
    answer: "You can audit even a single date of service. We support flexibility.",
  },
  {
    question: "How many charts can I upload at once?",
    answer: "There is no strict limit, but we recommend batch uploads of up to 100 for optimal performance.",
  },
];

const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`rounded-xl border ${
            openIndex === index ? 'bg-blue-900 text-white' : 'bg-white text-black'
          } transition duration-300`}
        >
          <button
            onClick={() => toggle(index)}
            className="w-full flex justify-between items-center p-4 font-medium text-left"
          >
            <span>{faq.question}</span>
            {openIndex === index ? (
              <FaMinus className="text-white" />
            ) : (
              <FaPlus className="text-blue-700" />
            )}
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 text-sm text-white">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;
