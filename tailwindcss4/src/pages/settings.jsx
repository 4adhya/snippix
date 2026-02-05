import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Lock,
  Shield,
  FileText,
  LogOut,
  Trash2,
  ChevronRight,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signOut,
  deleteUser,
  updateProfile,
} from "firebase/auth";
import { getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import ReportProblemModal from "../components/reportproblem.jsx";

/* ================= ANIMATIONS ================= */

const pageVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const containerVariant = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function Settings() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [profile, setProfile] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [privateAccount, setPrivateAccount] = useState(false);

  const [photoURL, setPhotoURL] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.currentUser) return;
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setPrivateAccount(data.isPrivate ?? false);
      }
      if (auth.currentUser.photoURL) {
        setPhotoURL(auth.currentUser.photoURL);
      }
    };
    fetchUser();
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !auth.currentUser) return;

    try {
      setUploading(true);
      const imageRef = ref(storage, `profilePhotos/${auth.currentUser.uid}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      setPhotoURL(downloadURL);
    } finally {
      setUploading(false);
    }
  };

  const togglePrivateAccount = async () => {
    const newValue = !privateAccount;
    setPrivateAccount(newValue);
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isPrivate: newValue,
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Delete your account permanently?")) return;
    await deleteDoc(doc(db, "users", auth.currentUser.uid));
    await deleteUser(auth.currentUser);
    navigate("/login");
  };

  return (
    <motion.div
      variants={pageVariant}
      initial="hidden"
      animate="show"
      className="min-h-screen text-white bg-[radial-gradient(circle_at_top,_#1FAE78_0%,_#123D2B_30%,_#0B1F17_70%)] px-4 py-6"
    >
      {/* HEADER */}
      <motion.div
        variants={itemVariant}
        className="relative mb-10 max-w-2xl mx-auto"
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 top-0 p-3 rounded-full hover:bg-white/10 transition"
        >
          <ArrowLeft size={26} />
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-emerald-200/70">
            Manage your Snippix space
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="show"
        className="max-w-2xl mx-auto"
      >
        {/* PROFILE */}
        <motion.div variants={itemVariant}>
          <GlassCard>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-400 shadow-jade-soft"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center font-bold shadow-jade-soft">
                    {profile?.fullName?.charAt(0) || "U"}
                  </div>
                )}
                <input type="file" hidden onChange={handlePhotoUpload} />
              </label>

              <div className="flex-1">
                <h3 className="text-xl font-semibold">
                  {profile?.fullName || "User"}
                </h3>
                <p className="text-emerald-200/60 text-sm">
                  {auth.currentUser?.email}
                </p>
                {uploading && (
                  <p className="text-xs text-emerald-300">Uploading…</p>
                )}
              </div>

              <button
                onClick={() => navigate("/edit-profile")}
                className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30"
              >
                Edit
              </button>
            </div>
          </GlassCard>
        </motion.div>

        <Section title="Account">
          <SettingItem icon={User} title="Edit Profile" subtitle="Update your info" />
          <SettingItem icon={Lock} title="Change Password" subtitle="Update password" />
        </Section>

        <Section title="Notifications">
          <ToggleItem icon={Bell} title="Push Notifications" value={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
          <ToggleItem icon={Bell} title="Email Notifications" value={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
        </Section>

        <Section title="Privacy & Security">
          <ToggleItem icon={Shield} title="Private Account" value={privateAccount} onChange={togglePrivateAccount} />
        </Section>

        <div className="space-y-3 mt-6">
          <button onClick={handleLogout} className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 flex justify-center gap-2">
            <LogOut /> Log Out
          </button>

          <button onClick={handleDeleteAccount} className="w-full py-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 flex justify-center gap-2">
            <Trash2 /> Delete Account
          </button>
        </div>
      </motion.div>

      {showReportModal && (
        <ReportProblemModal onClose={() => setShowReportModal(false)} />
      )}
    </motion.div>
  );
}

/* ================= COMPONENTS ================= */

const GlassCard = ({ children }) => (
  <div className="mb-6 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-jade-soft">
    {children}
  </div>
);

const Section = ({ title, children }) => (
  <motion.div variants={containerVariant} className="mb-6">
    <h2 className="text-sm font-semibold mb-3 text-emerald-200/60 uppercase">
      {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </motion.div>
);

const SettingItem = ({ icon: Icon, title, subtitle }) => (
  <motion.button
    variants={itemVariant}
    whileTap={{ scale: 0.97 }}
    className="w-full flex justify-between items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
  >
    <div className="flex gap-4 items-center">
      <div className="p-2 rounded-lg bg-emerald-500/10">
        <Icon size={20} className="text-emerald-300" />
      </div>
      <div className="text-left">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-emerald-200/60">{subtitle}</p>
      </div>
    </div>
    <ChevronRight className="text-emerald-300" />
  </motion.button>
);

const ToggleItem = ({ icon: Icon, title, value, onChange }) => (
  <motion.div
    variants={itemVariant}
    className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10"
  >
    <div className="flex gap-4 items-center">
      <div className="p-2 rounded-lg bg-emerald-500/10">
        <Icon size={20} className="text-emerald-300" />
      </div>
      <p>{title}</p>
    </div>
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition ${
        value ? "bg-emerald-400 shadow-jade-soft" : "bg-white/20"
      }`}
    >
      <div
        className={`h-5 w-5 bg-white rounded-full transition ${
          value ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  </motion.div>
);
