import React, { useEffect, useState } from "react";
import {
  User,
  Bell,
  Lock,
  Shield,
  FileText,
  LogOut,
  Trash2,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  HelpCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signOut,
  deleteUser,
} from "firebase/auth";
import { getDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import ReportProblemModal from "../components/reportproblem.jsx";

export default function Settings() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [profile, setProfile] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [privateAccount, setPrivateAccount] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.currentUser) return;
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (snap.exists()) setProfile(snap.data());
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      navigate("/login");
    } catch (error) {
      alert("Please login again to delete your account.");
      navigate("/login");
    }
  };

  const SettingItem = ({ icon: Icon, title, subtitle, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-neutral-900 rounded-xl hover:bg-neutral-800"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-neutral-800 rounded-lg">
          <Icon size={20} className="text-gray-400" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
      </div>
      <ChevronRight size={20} className="text-gray-500" />
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-2xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* PROFILE */}
      <div className="mb-8 p-6 bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {profile?.fullName?.charAt(0) || "U"}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold">
              {profile?.fullName || "User"}
            </h3>
            <p className="text-gray-400 text-sm">
              {auth.currentUser?.email}
            </p>
          </div>

          <button
            onClick={() => navigate("/edit-profile")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          >
            Edit
          </button>
        </div>
      </div>

      {/* ACCOUNT */}
      <Section title="Account">
        <SettingItem icon={User} title="Edit Profile" subtitle="Update your info" onClick={() => navigate("/edit-profile")} />
        <SettingItem icon={Lock} title="Change Password" subtitle="Update password" onClick={() => navigate("/change-password")} />
      </Section>

      {/* NOTIFICATIONS */}
      <Section title="Notifications">
        <ToggleItem icon={Bell} title="Push Notifications" value={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
        <ToggleItem icon={Bell} title="Email Notifications" value={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
      </Section>

      {/* PRIVACY */}
      <Section title="Privacy & Security">
        <ToggleItem icon={Shield} title="Private Account" value={privateAccount} onChange={() => setPrivateAccount(!privateAccount)} />
      </Section>

      {/* HELP */}
      <Section title="Help & Support">
        <SettingItem icon={HelpCircle} title="Help Center" subtitle="Get help" />
        <SettingItem icon={FileText} title="Report a Problem" subtitle="Tell us what's wrong" onClick={() => setShowReportModal(true)} />
      </Section>

      {/* LEGAL */}
      <Section title="Legal">
        <Link to="/terms">
          <SettingItem icon={FileText} title="Terms & Conditions" subtitle="Review our terms" />
        </Link>

        <Link to="/privacy">
          <SettingItem icon={FileText} title="Privacy Policy" subtitle="How we protect your data" />
        </Link>
      </Section>

      {/* LOGOUT */}
      <div className="mt-6 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex justify-center items-center gap-2 py-4 bg-neutral-900 hover:bg-neutral-800 rounded-xl"
        >
          <LogOut /> Log Out
        </button>

        <button
          onClick={handleDeleteAccount}
          className="w-full py-4 bg-red-600/20 text-red-400 rounded-xl flex justify-center items-center gap-2 hover:bg-red-600/30"
        >
          <Trash2 /> Delete Account
        </button>
      </div>

      {showReportModal && <ReportProblemModal onClose={() => setShowReportModal(false)} />}
    </div>
  );
}

/* HELPERS */

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-sm font-semibold mb-3 text-gray-400 uppercase">
      {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const ToggleItem = ({ icon: Icon, title, value, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-xl">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-neutral-800 rounded-lg">
        <Icon size={20} className="text-gray-400" />
      </div>
      <p>{title}</p>
    </div>
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition ${
        value ? "bg-blue-600" : "bg-gray-600"
      }`}
    >
      <div
        className={`h-5 w-5 bg-white rounded-full transform transition ${
          value ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);
