import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="text-gray-400 mb-4">
        Your privacy is important to us. This policy explains how we collect,
        use, and protect your personal data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="text-gray-400">
        We collect basic information such as your name, email address, and
        profile details to provide our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Data</h2>
      <p className="text-gray-400">
        Your data is used to manage your account, improve our services, and
        ensure security.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Security</h2>
      <p className="text-gray-400">
        We use industry-standard security practices to protect your data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Deletion</h2>
      <p className="text-gray-400">
        You may delete your account at any time. Once deleted, your data is
        permanently removed from our systems.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to Policy</h2>
      <p className="text-gray-400">
        We may update this privacy policy from time to time. Changes will be
        reflected here.
      </p>

      <p className="text-gray-500 mt-8 text-sm">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
