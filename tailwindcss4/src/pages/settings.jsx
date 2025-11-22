import React, { useState, useEffect } from "react";
import {
  User,
  Bell,
  Lock,
  Palette,
  HelpCircle,
  Shield,
  FileText,
  LogOut,
  Trash2,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import ReportProblemModal from "../components/reportproblem.jsx";

import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Settings() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [showReportModal, setShowReportModal] = useState(false);

  // Firebase user state
  const [firebaseUser, setFirebaseUser] = useState(null);

  // Load Firebase user on page load
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleLogout = () => {
    alert("Logging out...");
  };

  // Reusable Toggle Component
  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-gray-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  // Reusable Setting Item
  const SettingItem = ({ icon: Icon, title, subtitle, onClick, showArrow = true }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-neutral-800 rounded-lg">
          <Icon size={20} className="text-gray-400" />
        </div>
        <div className="text-left">
          <p className="font-medium">{title}</p>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {showArrow && <ChevronRight size={20} className="text-gray-500" />}
    </button>
  );

  // Toggle Item Row
  const ToggleItem = ({ icon: Icon, title, subtitle, checked, onChange }) => (
    <div className="w-full flex items-center justify-between p-4 bg-neutral-900 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-neutral-800 rounded-lg">
          <Icon size={20} className="text-gray-400" />
        </div>
        <div className="text-left">
          <p className="font-medium">{title}</p>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );

  // Theme Selector Section
  const ThemeSelector = () => (
    <div className="w-full p-4 bg-neutral-900 rounded-xl">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 bg-neutral-800 rounded-lg">
          <Palette size={20} className="text-gray-400" />
        </div>
        <div className="text-left">
          <p className="font-medium">Theme</p>
          <p className="text-sm text-gray-400 mt-0.5">Customize your appearance</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-3">
        <button
          onClick={() => setTheme("light")}
          className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
            theme === "light" ? "bg-blue-600" : "bg-neutral-800 hover:bg-neutral-700"
          }`}
        >
          <Sun size={20} />
          <span className="text-xs">Light</span>
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
            theme === "dark" ? "bg-blue-600" : "bg-neutral-800 hover:bg-neutral-700"
          }`}
        >
          <Moon size={20} />
          <span className="text-xs">Dark</span>
        </button>

        <button
          onClick={() => setTheme("system")}
          className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
            theme === "system" ? "bg-blue-600" : "bg-neutral-800 hover:bg-neutral-700"
          }`}
        >
          <Monitor size={20} />
          <span className="text-xs">System</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-2xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* PROFILE CARD */}
      <div className="mb-8 p-6 bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {firebaseUser?.displayName?.charAt(0) || "U"}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">
              {firebaseUser?.displayName || "User"}
            </h3>
            <p className="text-gray-400 text-sm">
              {firebaseUser?.email || "user@example.com"}
            </p>
          </div>
          <button
            onClick={() => alert("Edit Profile clicked")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Edit
          </button>
        </div>
      </div>

      {/* ACCOUNT SECTION */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">Account</h2>
        <div className="space-y-3">
          <SettingItem icon={User} title="Edit Profile" subtitle="Update your photo, bio, and details" onClick={() => alert("Edit Profile")} />
          <SettingItem icon={Lock} title="Change Password" subtitle="Update your password regularly" onClick={() => alert("Change Password")} />
        </div>
      </div>

      {/* NOTIFICATIONS SECTION */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">Notifications</h2>
        <div className="space-y-3">
          <ToggleItem
            icon={Bell}
            title="Push Notifications"
            subtitle="Receive alerts on this device"
            checked={pushNotifications}
            onChange={setPushNotifications}
          />
          <ToggleItem
            icon={Bell}
            title="Email Notifications"
            subtitle="Get updates via email"
            checked={emailNotifications}
            onChange={setEmailNotifications}
          />
        </div>
      </div>

      {/* APPEARANCE */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">Appearance</h2>
        <ThemeSelector />
      </div>

      {/* SECURITY */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">Privacy & Security</h2>
        <div className="space-y-3">
          <ToggleItem
            icon={Shield}
            title="Private Account"
            subtitle="Only approved followers can see your posts"
            checked={privateAccount}
            onChange={setPrivateAccount}
          />
          <SettingItem icon={Lock} title="Blocked Accounts" subtitle="Manage blocked users" onClick={() => alert("Blocked Accounts")} />
          <SettingItem icon={Shield} title="Two-Step Verification" subtitle="Add extra security to your account" onClick={() => alert("Two-Step Verification")} />
        </div>
      </div>

      {/* HELP */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">Help & Support</h2>
        <div className="space-y-3">
          <SettingItem icon={HelpCircle} title="Help Center" subtitle="Get help and support" onClick={() => alert("Help Center")} />
          <SettingItem icon={FileText} title="Report a Problem" subtitle="Let us know if something isn't working" onClick={() => setShowReportModal(true)} />
        </div>
      </div>

      {/* LEGAL */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">Legal</h2>
        <div className="space-y-3">
          <SettingItem icon={FileText} title="Terms & Conditions" subtitle="Review our terms of service" onClick={() => alert("Terms & Conditions")} />
          <SettingItem icon={FileText} title="Privacy Policy" subtitle="Learn how we protect your data" onClick={() => alert("Privacy Policy")} />
        </div>
      </div>

      {/* LOGOUT + DELETE */}
      <div className="mb-8 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-neutral-900 hover:bg-neutral-800 py-4 rounded-xl font-semibold transition-colors border border-neutral-800"
        >
          <LogOut size={20} />
          Log Out
        </button>

        <button
          onClick={() => {
            if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
              alert("Account deletion initiated");
            }
          }}
          className="w-full flex items-center justify-center gap-3 bg-red-600/10 hover:bg-red-600/20 py-4 rounded-xl font-semibold text-red-400 transition-colors border border-red-600/20"
        >
          <Trash2 size={20} />
          Delete Account
        </button>
      </div>

      {/* FOOTER */}
      <div className="text-center text-gray-500 text-sm pb-6">
        <p>Version 1.0.0</p>
      </div>

      {showReportModal && <ReportProblemModal onClose={() => setShowReportModal(false)} />}
    </div>
  );
}
