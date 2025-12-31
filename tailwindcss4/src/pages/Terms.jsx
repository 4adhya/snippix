import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="text-gray-400 mb-4">
        Welcome to Snippix. By accessing or using this application, you agree to
        be bound by these Terms and Conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of the App</h2>
      <p className="text-gray-400">
        You agree to use Snippix only for lawful purposes and in a way that does
        not violate the rights of others or restrict their use of the platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. User Accounts</h2>
      <p className="text-gray-400">
        You are responsible for maintaining the confidentiality of your account
        and password. Any activity under your account is your responsibility.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Content</h2>
      <p className="text-gray-400">
        You are responsible for any content you create or upload. We reserve the
        right to remove content that violates our policies.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Termination</h2>
      <p className="text-gray-400">
        We reserve the right to suspend or terminate accounts that violate these
        terms without prior notice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes</h2>
      <p className="text-gray-400">
        We may update these terms at any time. Continued use of the app means you
        accept the updated terms.
      </p>

      <p className="text-gray-500 mt-8 text-sm">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
