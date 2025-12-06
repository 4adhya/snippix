import React from "react";

export default function LegalModal({ title, content, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 text-white w-[90%] max-w-2xl max-h-[80%] p-6 rounded-2xl border border-neutral-700 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        <div className="space-y-4 text-gray-300 leading-relaxed text-sm">
          {content}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
