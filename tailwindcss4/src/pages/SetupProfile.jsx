import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const BIO_LIMIT = 120;

export default function SetupProfile() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Creator");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setFullName(data.fullName || "");
          setUsername(data.username || "");
          setRole(data.role || "Creator");
          setBio(data.bio || "");
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!user) return;

    if (!fullName.trim()) {
      alert("Please enter your full name");
      return;
    }

    setSaving(true);

    const initials = fullName
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          fullName: fullName.trim(),
          username: username.trim(),
          role: role.trim(),
          bio: bio.trim(),
          initials,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      navigate("/profiles"); // change if needed
    } catch (err) {
      console.error("Failed to save profile", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ================= SKIP ================= */

  const handleSkip = () => {
    navigate("/profiles"); // or home/dashboard
  };

  /* ================= STATES ================= */

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Please log in first.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading profile…
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="relative w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

        {/* BACK ARROW */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 p-3 rounded-full hover:bg-white/10 transition"
        >
          <ArrowLeft size={28} />
        </button>

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-8 text-center">
          Set up your profile
        </h1>

        {/* FORM */}
        <div className="space-y-4">

          <input
            className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-white/10 outline-none focus:border-purple-500 transition"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-white/10 outline-none focus:border-purple-500 transition"
            placeholder="Username (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-white/10 outline-none focus:border-purple-500 transition"
            placeholder="Role (Creator, Photographer, etc)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          {/* BIO + COUNTER */}
          <div>
            <textarea
              className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-white/10 outline-none focus:border-purple-500 transition resize-none"
              placeholder="Short bio"
              rows={3}
              maxLength={BIO_LIMIT}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              Bio ({bio.length} / {BIO_LIMIT})
            </p>
          </div>

          {/* SAVE */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>

          {/* SKIP */}
          <button
            onClick={handleSkip}
            className="w-full text-sm text-gray-400 hover:text-white transition mt-2"
          >
            Skip → complete later
          </button>

        </div>
      </div>
    </div>
  );
}
