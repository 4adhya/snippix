import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { auth } from "../firebase";
import { db } from "../firebase";
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // 🔹 Listen to user document in real-time
    const unsubscribeUser = onSnapshot(
      doc(db, "users", currentUser.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    );

    // 🔹 Listen to posts in real-time
    const q = query(
      collection(db, "posts"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const userPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(userPosts);
    });

    return () => {
      unsubscribeUser();
      unsubscribePosts();
    };
  }, []);

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-24 px-8 max-w-4xl mx-auto">
        {/* PROFILE HEADER */}
        <div className="flex items-center gap-8 mb-10">
          {/* Profile Picture */}
          <div className="w-28 h-28 rounded-full bg-white/20 overflow-hidden">
            {userData.photoURL && (
              <img
                src={userData.photoURL}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div>
            {/* 🔥 REAL NAME */}
            <h1 className="text-3xl font-bold">
              {userData.username ||
                userData.name ||
                userData.displayName ||
                auth.currentUser.displayName ||
                "User"}
            </h1>

            {/* 🔥 REAL BIO */}
            <p className="text-white/60">
              {userData.bio || ""}
            </p>

            {/* COUNTS */}
            <div className="flex gap-6 mt-4 text-sm">
              <span>
                <b>{posts.length}</b> Posts
              </span>

              <span>
                <b>{userData.followers?.length || 0}</b> Followers
              </span>

              <span>
                <b>{userData.following?.length || 0}</b> Following
              </span>
            </div>

            <button
              onClick={() => window.location.href="/edit-profile"}
              className="mt-4 px-4 py-2 bg-white text-black rounded-lg"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* POSTS GRID */}
        {posts.length === 0 ? (
          <p className="text-white/40">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {posts.map((post) => (
              <img
                key={post.id}
                src={post.imageUrl}
                alt=""
                className="aspect-square object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}