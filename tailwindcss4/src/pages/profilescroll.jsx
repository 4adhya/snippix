import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const profiles = [
  { id: 1, name: "Alex Carter", role: "Designer", gradient: "from-purple-500 via-pink-500 to-red-500", image: "AC" },
  { id: 2, name: "Jamie Rivera", role: "Developer", gradient: "from-blue-500 via-cyan-500 to-teal-500", image: "JR" },
  { id: 3, name: "Taylor Brooks", role: "Photographer", gradient: "from-orange-500 via-amber-500 to-yellow-500", image: "TB" },
  { id: 4, name: "Morgan Lee", role: "Animator", gradient: "from-green-500 via-emerald-500 to-teal-500", image: "ML" },
  { id: 5, name: "Jordan Smith", role: "Writer", gradient: "from-pink-500 via-rose-500 to-red-500", image: "JS" },
  { id: 6, name: "Casey Monroe", role: "Artist", gradient: "from-indigo-500 via-purple-500 to-pink-500", image: "CM" },
  { id: 7, name: "Riley Parker", role: "Musician", gradient: "from-cyan-500 via-blue-500 to-indigo-500", image: "RP" },
  { id: 8, name: "Skylar Reed", role: "Chef", gradient: "from-yellow-500 via-orange-500 to-red-500", image: "SR" },
  { id: 9, name: "Dakota Quinn", role: "Dancer", gradient: "from-fuchsia-500 via-purple-500 to-indigo-500", image: "DQ" },
  { id: 10, name: "Avery Cole", role: "Architect", gradient: "from-teal-500 via-cyan-500 to-blue-500", image: "AC" },
  { id: 11, name: "Sage Williams", role: "Poet", gradient: "from-rose-500 via-pink-500 to-purple-500", image: "SW" },
  { id: 12, name: "River Hayes", role: "Filmmaker", gradient: "from-lime-500 via-green-500 to-emerald-500", image: "RH" },
  { id: 13, name: "Phoenix Gray", role: "Producer", gradient: "from-amber-500 via-orange-500 to-red-500", image: "PG" },
  { id: 14, name: "Rowan Kim", role: "Director", gradient: "from-violet-500 via-purple-500 to-fuchsia-500", image: "RK" },
  { id: 15, name: "Harper Chen", role: "Illustrator", gradient: "from-sky-500 via-blue-500 to-indigo-500", image: "HC" },
  { id: 16, name: "Finley Ross", role: "Sculptor", gradient: "from-red-500 via-orange-500 to-yellow-500", image: "FR" },
  { id: 17, name: "Quinn Martinez", role: "Curator", gradient: "from-emerald-500 via-teal-500 to-cyan-500", image: "QM" },
  { id: 18, name: "Emerson Wade", role: "DJ", gradient: "from-pink-500 via-fuchsia-500 to-purple-500", image: "EW" },
  { id: 19, name: "Lennon Foster", role: "Stylist", gradient: "from-blue-500 via-indigo-500 to-violet-500", image: "LF" },
  { id: 20, name: "Drew Sullivan", role: "Editor", gradient: "from-orange-500 via-red-500 to-pink-500", image: "DS" },
  { id: 21, name: "Blake Torres", role: "Model", gradient: "from-cyan-500 via-teal-500 to-green-500", image: "BT" },
  { id: 22, name: "Cameron Price", role: "Composer", gradient: "from-purple-500 via-violet-500 to-fuchsia-500", image: "CP" },
  { id: 23, name: "Ellis Knight", role: "Painter", gradient: "from-yellow-500 via-lime-500 to-green-500", image: "EK" },
  { id: 24, name: "Reese Morgan", role: "Performer", gradient: "from-rose-500 via-red-500 to-orange-500", image: "RM" },
  { id: 25, name: "Logan West", role: "Creative", gradient: "from-indigo-500 via-blue-500 to-cyan-500", image: "LW" },
];

const groupProfiles = (profiles) => {
  const grouped = [];
  let i = 0;
  while (i < profiles.length) {
    const groupSize = (grouped.length % 2 === 0) ? 3 : 2; // 3 on odd rows, 2 on even rows
    grouped.push(profiles.slice(i, i + groupSize));
    i += groupSize;
  }
  return grouped;
};

const groupedProfiles = groupProfiles(profiles);

function ProfileCard({ profile }) {
  return (
    <motion.div
      key={profile.id}
      // Increased height and removed fixed width for more fluid sizing
      className="h-[450px] rounded-xl shadow-xl overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }} // Slightly less scale on hover to fit denser layout
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${profile.gradient}`} />
      
      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-8 text-white"> {/* Increased padding */}
        {/* Profile Image - Circular with initials */}
        <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg"> {/* Larger initials circle, removed border */}
          <span className="text-5xl font-black text-white">{profile.image}</span> {/* Larger initials text */}
        </div>
        
        {/* Name */}
        <h2 className="text-3xl font-black mb-2 text-center leading-tight tracking-tight drop-shadow-lg"> {/* Larger name text */}
          {profile.name}
        </h2>
        
        {/* Role */}
        <p className="text-lg font-semibold text-white/90 uppercase tracking-wider"> {/* Larger role text */}
          {profile.role}
        </p>
      </div>
    </motion.div>
  );
}

export default function ProfileScroll() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-center mb-16">Creative Profiles</h1> {/* Larger title */}
        
        <div className="space-y-6"> {/* Reduced space between rows for denser packing */}
          {groupedProfiles.map((row, rowIndex) => {
            const isRowOfThree = row.length === 3;
            
            return (
              <div
                key={rowIndex}
                // Adjusting grid for denser, larger cards
                // Using 2 cols on md for all rows to ensure larger cards fit well,
                // and for the 3-card row, it will stack one below two on larger screens.
                // For a true "mosaic", you might want more complex custom column spans.
                className={`grid gap-6 ${ // Reduced gap between cards
                  isRowOfThree
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" // Three cards side-by-side where possible
                    : "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto" // Two cards, centered
                }`}
              >
                {row.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}