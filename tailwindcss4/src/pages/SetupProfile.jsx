import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function SetupProfile() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Creator");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Load existing profile (if any)
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setFullName(data.fullName || "");
        setUsername(data.username || "");
        setRole(data.role || "Creator");
        setBio(data.bio || "");
      }

      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    if (!fullName.trim()) {
      alert("Please enter your name");
      return;
    }

    setSaving(true);

    const initials = fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        fullName,
        username,
        role,
        bio,
        initials,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setSaving(false);
    navigate("/profiles"); // change if needed
  };

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

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Set up your profile
        </h1>

        <div className="space-y-4">
          <input
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
            placeholder="Username (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
            placeholder="Role (Creator, Photographer, etc)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <textarea
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
            placeholder="Short bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
