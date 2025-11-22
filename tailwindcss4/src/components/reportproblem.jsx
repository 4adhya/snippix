import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function ReportProblemModal({ onClose }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      await addDoc(collection(db, "reports"), {
        userId: user.uid,
        email: user.email,
        message: message,
        createdAt: serverTimestamp(),
      });

      setSent(true);
      setMessage("");
    } catch (error) {
      console.error("REPORT ERROR:", error);
      alert("Error submitting report: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="w-[90%] max-w-md bg-neutral-900 p-6 rounded-2xl shadow-xl">

        <h2 className="text-xl font-semibold text-white mb-3">
          Report a Problem
        </h2>

        {sent ? (
          <p className="text-green-400 mb-4">Your report has been sent ✔</p>
        ) : (
          <textarea
            className="w-full h-32 bg-neutral-800 text-white p-3 rounded-xl outline-none"
            placeholder="Describe the issue you are facing..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded-lg text-white"
          >
            Close
          </button>

          {!sent && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 rounded-lg text-white"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
