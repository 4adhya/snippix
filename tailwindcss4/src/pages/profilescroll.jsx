import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // correct path based on your structure

/* ---------------- GROUPING LOGIC ---------------- */
// 3 cards, then 2 cards, repeat
const groupProfiles = (profiles) => {
  const grouped = [];
  let i = 0;

  while (i < profiles.length) {
    const groupSize = grouped.length % 2 === 0 ? 3 : 2;
    grouped.push(profiles.slice(i, i + groupSize));
    i += groupSize;
  }

  return grouped;
};

/* ---------------- PROFILE CARD ---------------- */
function ProfileCard({ profile }) {
  return (
    <motion.div
      className="h-[450px] rounded-xl shadow-xl overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${profile.gradient}`} />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
        {/* Initials circle */}
        <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg">
          <span className="text-5xl font-black">{profile.initials}</span>
        </div>

        {/* Name */}
        <h2 className="text-3xl font-black mb-2 text-center tracking-tight">
          {profile.name}
        </h2>

        {/* Role */}
        <p className="text-lg font-semibold uppercase tracking-wider text-white/90">
          {profile.role}
        </p>
      </div>
    </motion.div>
  );
}

/* ---------------- MAIN PAGE ---------------- */
export default function ProfileScroll() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------- FETCH USERS FROM FIRESTORE -------- */
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));

        const users = snapshot.docs.map((doc, index) => {
          const data = doc.data();

          return {
            id: doc.id,
            name: data.fullName || "User",
            role: data.role || "Creator",
            initials:
              data.initials ||
              (data.fullName
                ? data.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"),
            gradient: [
              "from-purple-500 via-pink-500 to-red-500",
              "from-blue-500 via-cyan-500 to-teal-500",
              "from-green-500 via-emerald-500 to-teal-500",
              "from-orange-500 via-amber-500 to-yellow-500",
              "from-indigo-500 via-purple-500 to-pink-500",
            ][index % 5],
          };
        });

        console.log("Fetched users:", users);
        setProfiles(users);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const groupedProfiles = groupProfiles(profiles);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-center mb-16">
          Creative Profiles
        </h1>

        {/* Loading */}
        {loading && (
          <p className="text-center text-white/60">Loading profiles…</p>
        )}

        {/* Profiles */}
        {!loading && (
          <div className="space-y-6">
            {groupedProfiles.map((row, rowIndex) => {
              const isRowOfThree = row.length === 3;

              return (
                <div
                  key={rowIndex}
                  className={`grid gap-6 ${
                    isRowOfThree
                      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto"
                  }`}
                >
                  {row.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
