import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { auth } from "../firebase";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // 🔹 Fetch user data
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }

      // 🔹 Fetch user posts
      const q = query(
        collection(db, "posts"),
        where("userId", "==", currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const userPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(userPosts);
    };

    fetchData();
  }, []);

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-24 px-8 max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-8 mb-10">
          <div className="w-28 h-28 rounded-full bg-white/20" />

          <div>
            <h1 className="text-3xl font-bold">
              {userData.name || "User"}
            </h1>

            <p className="text-white/60">
              {userData.bio || "Creator"}
            </p>

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