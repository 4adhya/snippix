import React from "react";
import Navbar from "../components/navbar";

export default function Profile() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-24 px-8 max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex items-center gap-8 mb-10">
          <div className="w-28 h-28 rounded-full bg-white/20" />

          <div>
            <h1 className="text-3xl font-bold">Janvi</h1>
            <p className="text-white/60">Creator • Designer</p>

            <div className="flex gap-6 mt-4 text-sm">
              <span><b>12</b> Posts</span>
              <span><b>340</b> Followers</span>
              <span><b>180</b> Following</span>
            </div>

            <button className="mt-4 px-4 py-2 bg-white text-black rounded-lg">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((item) => (
            <div
              key={item}
              className="aspect-square bg-white/10 rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}