import React from "react";
import { useNavigate } from "react-router-dom";

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Help Center</h1>
      <p className="text-gray-400 mb-8">
        Find answers or contact support
      </p>

      <div className="space-y-4">
        <HelpItem
          title="How does Snippix work?"
          desc="Create, save, and share code snippets easily."
        />
        <HelpItem
          title="Why is my account private?"
          desc="Private accounts are not visible in Explore."
        />
        <HelpItem
          title="Forgot password?"
          desc="Go to Change Password from settings."
        />
      </div>

      <button
        onClick={() => navigate("/settings")}
        className="mt-10 px-4 py-2 bg-neutral-800 rounded-lg"
      >
        Back to Settings
      </button>
    </div>
  );
}

const HelpItem = ({ title, desc }) => (
  <div className="p-4 bg-neutral-900 rounded-xl">
    <p className="font-medium">{title}</p>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);
