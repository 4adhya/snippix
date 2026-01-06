import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null); // null | true | false
  const [error, setError] = useState("");

  // 🔹 Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;

      const snap = await getDoc(
        doc(db, "users", auth.currentUser.uid)
      );

      if (snap.exists()) {
        const data = snap.data();
        setFullName(data.fullName || "");
        setUsername(data.username || "");
        setBio(data.bio || "");
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  // 🔹 Debounced live username check
  useEffect(() => {
    if (!username.trim()) {
      setIsAvailable(null);
      return;
    }

    const cleanUsername = username.toLowerCase().trim();

    if (cleanUsername.length < 3) {
      setIsAvailable(null);
      return;
    }

    setChecking(true);

    const timer = setTimeout(async () => {
      const q = query(
        collection(db, "users"),
        where("username", "==", cleanUsername)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        setIsAvailable(true);
      } else if (
        snap.docs.length === 1 &&
        snap.docs[0].id === auth.currentUser.uid
      ) {
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
      }

      setChecking(false);
    }, 500); // ⏱ debounce delay

    return () => clearTimeout(timer);
  }, [username]);

  // 🔹 Save profile
  const handleSave = async () => {
    setError("");

    if (!fullName.trim() || !username.trim()) {
      setError("Full name and username are required");
      return;
    }

    if (isAvailable === false) {
      setError("Username is already taken");
      return;
    }

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      fullName,
      username: username.toLowerCase().trim(),
      bio,
      updatedAt: Date.now(),
    });

    navigate("/settings");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
      <p className="text-gray-400 mb-8">
        Update your personal information
      </p>

      {/* Full Name */}
      <div className="mb-5">
        <label className="text-sm text-gray-400">Full Name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      {/* Username */}
      <div className="mb-3">
        <label className="text-sm text-gray-400">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />

        {/* Live status */}
        <div className="mt-2 text-sm">
          {checking && (
            <span className="text-gray-400">Checking availability…</span>
          )}
          {!checking && isAvailable === true && (
            <span className="text-green-400">✓ Username available</span>
          )}
          {!checking && isAvailable === false && (
            <span className="text-red-400">✕ Username already taken</span>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="mb-6">
        <label className="text-sm text-gray-400">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/settings")}
          className="flex-1 py-3 bg-neutral-800 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={checking || isAvailable === false}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
