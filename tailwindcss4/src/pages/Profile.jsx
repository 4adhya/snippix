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
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { uid } = useParams();
  const currentUser = auth.currentUser;
  const profileUID = uid || currentUser?.uid;

  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!profileUID) return;

    const unsubscribeUser = onSnapshot(
      doc(db, "users", profileUID),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);

          if (currentUser) {
            setIsFollowing(
              data.followers?.includes(currentUser.uid)
            );
          }
        }
      }
    );

    const q = query(
      collection(db, "posts"),
      where("userId", "==", profileUID)
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
  }, [profileUID, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) return;

    const profileRef = doc(db, "users", profileUID);
    const currentUserRef = doc(db, "users", currentUser.uid);

    if (isFollowing) {
      await updateDoc(profileRef, {
        followers: arrayRemove(currentUser.uid),
      });

      await updateDoc(currentUserRef, {
        following: arrayRemove(profileUID),
      });
    } else {
      await updateDoc(profileRef, {
        followers: arrayUnion(currentUser.uid),
      });

      await updateDoc(currentUserRef, {
        following: arrayUnion(profileUID),
      });
    }
  };

  if (!userData) return null;

  const isOwnProfile = currentUser?.uid === profileUID;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-24 px-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-8 mb-10">
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
            <h1 className="text-3xl font-bold">
              {userData.name || "User"}
            </h1>

            <p className="text-white/60">
              {userData.bio || ""}
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

            {!isOwnProfile && (
              <button
                onClick={handleFollow}
                className={`mt-4 px-5 py-2 rounded-lg transition ${
                  isFollowing
                    ? "bg-white text-black"
                    : "bg-blue-600 text-white"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>

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