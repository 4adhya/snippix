import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  // 🔹 Load current profile
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

  const handleSave = async () => {
    if (!fullName.trim() || !username.trim()) {
      alert("Name and username are required");
      return;
    }

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      fullName,
      username,
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
          placeholder="Your name"
        />
      </div>

      {/* Username */}
      <div className="mb-5">
        <label className="text-sm text-gray-400">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          placeholder="username"
        />
      </div>

      {/* Bio */}
      <div className="mb-8">
        <label className="text-sm text-gray-400">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none"
          placeholder="Tell something about yourself"
        />
      </div>

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
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
