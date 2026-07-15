import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { auth, db } from "../firebase";

import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";

import { useParams, useNavigate } from "react-router-dom";

export default function Profile() {
  const { uid } = useParams();
  const navigate = useNavigate();

  const currentUser = auth.currentUser;

  const profileUID = uid || currentUser?.uid;

  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("frames");

  const [showUserList, setShowUserList] = useState(false);
  const [userListTitle, setUserListTitle] = useState("");
  const [userList, setUserList] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  /* =====================================================
     FETCH PROFILE USER
  ===================================================== */

  useEffect(() => {
    if (!profileUID) return;

    const userRef = doc(db, "users", profileUID);

    const unsubscribeUser = onSnapshot(
      userRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          setUserData(null);
          return;
        }

        const data = docSnap.data();

        setUserData({
          id: docSnap.id,
          ...data,
        });

        if (currentUser) {
          setIsFollowing(
            Array.isArray(data.followers) &&
              data.followers.includes(currentUser.uid)
          );
        }
      },
      (error) => {
        console.error("Profile listener error:", error);
      }
    );

    return () => {
      unsubscribeUser();
    };
  }, [profileUID, currentUser?.uid]);

  /* =====================================================
     FETCH USER POSTS
  ===================================================== */

  useEffect(() => {
    if (!profileUID) return;

    const postsQuery = query(
      collection(db, "posts"),
      where("userId", "==", profileUID)
    );

    const unsubscribePosts = onSnapshot(
      postsQuery,
      (snapshot) => {
        const userPosts = snapshot.docs.map((postDoc) => ({
          id: postDoc.id,
          ...postDoc.data(),
        }));

        setPosts(userPosts);
      },
      (error) => {
        console.error("Posts listener error:", error);
      }
    );

    return () => {
      unsubscribePosts();
    };
  }, [profileUID]);

  /* =====================================================
     FOLLOW / UNFOLLOW
  ===================================================== */

  const handleFollow = async () => {
    if (!currentUser) {
      console.log("No logged in user");
      return;
    }

    if (!profileUID) {
      return;
    }

    if (currentUser.uid === profileUID) {
      return;
    }

    if (followLoading) {
      return;
    }

    setFollowLoading(true);

    try {
      const profileRef = doc(db, "users", profileUID);

      const currentUserRef = doc(
        db,
        "users",
        currentUser.uid
      );

      if (isFollowing) {
        /* ================= UNFOLLOW ================= */

        await updateDoc(profileRef, {
          followers: arrayRemove(currentUser.uid),
        });

        await updateDoc(currentUserRef, {
          following: arrayRemove(profileUID),
        });

        setIsFollowing(false);
      } else {
        /* ================= FOLLOW ================= */

        await updateDoc(profileRef, {
          followers: arrayUnion(currentUser.uid),
        });

        await updateDoc(currentUserRef, {
          following: arrayUnion(profileUID),
        });

        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Follow / unfollow error:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  /* =====================================================
     OPEN FOLLOWERS / FOLLOWING LIST
  ===================================================== */

  const openUserList = async (type) => {
    if (!userData) return;

    const ids =
      type === "followers"
        ? userData.followers || []
        : userData.following || [];

    setUserListTitle(
      type === "followers" ? "Followers" : "Following"
    );

    setShowUserList(true);
    setListLoading(true);
    setUserList([]);

    try {
      const users = await Promise.all(
        ids.map(async (userUID) => {
          try {
            const userRef = doc(db, "users", userUID);

            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
              return null;
            }

            return {
              id: userSnap.id,
              ...userSnap.data(),
            };
          } catch (error) {
            console.error(
              "Error loading user:",
              userUID,
              error
            );

            return null;
          }
        })
      );

      setUserList(users.filter(Boolean));
    } catch (error) {
      console.error("User list error:", error);
    } finally {
      setListLoading(false);
    }
  };

  /* =====================================================
     OPEN USER PROFILE
  ===================================================== */

  const openUserProfile = (userUID) => {
    setShowUserList(false);

    if (userUID === currentUser?.uid) {
      navigate("/profile");
      return;
    }

    navigate(`/profile/${userUID}`);
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (!profileUID) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        <div className="pt-32 text-center text-white/50">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        <div className="pt-32 text-center text-white/50">
          Loading profile...
        </div>
      </div>
    );
  }

  const isOwnProfile =
    currentUser?.uid === profileUID;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-24 px-8 max-w-4xl mx-auto">

        {/* =================================================
            PROFILE HEADER
        ================================================= */}

        <div className="flex items-center gap-8 mb-10">

          {/* PROFILE PHOTO */}

          <div className="w-28 h-28 rounded-full bg-white/20 overflow-hidden flex-shrink-0">

            {userData.photoURL ? (
              <img
                src={userData.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-semibold text-white/50">
                {(
                  userData.fullName ||
                  userData.name ||
                  userData.username ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

          </div>

          {/* PROFILE DETAILS */}

          <div>

            {/* NAME */}

            <h1 className="text-3xl font-bold">

              {userData.fullName ||
                userData.name ||
                userData.username ||
                "User"}

            </h1>

            {/* USERNAME */}

            {userData.username && (
              <p className="text-white/50 mt-1">
                @{userData.username}
              </p>
            )}

            {/* BIO */}

            {userData.bio && (
              <p className="text-white/60 mt-1">
                {userData.bio}
              </p>
            )}

            {/* STATS */}

            <div className="flex gap-6 mt-4 text-sm">

              {/* FRAMES */}

              <span>
                <b>{posts.length}</b>{" "}
                Frames
              </span>

              {/* FOLLOWERS */}

              <button
                type="button"
                onClick={() =>
                  openUserList("followers")
                }
                className="hover:text-white/60 transition"
              >
                <b>
                  {userData.followers?.length || 0}
                </b>{" "}
                Followers
              </button>

              {/* FOLLOWING */}

              <button
                type="button"
                onClick={() =>
                  openUserList("following")
                }
                className="hover:text-white/60 transition"
              >
                <b>
                  {userData.following?.length || 0}
                </b>{" "}
                Following
              </button>

            </div>

            {/* =================================================
                ACTION BUTTON
            ================================================= */}

            {isOwnProfile ? (

              <button
                type="button"
                onClick={() =>
                  navigate("/edit-profile")
                }
                className="
                  mt-4
                  px-5
                  py-2
                  bg-white
                  text-black
                  rounded-lg
                  transition
                  duration-200
                  hover:bg-white/80
                  active:scale-95
                "
              >
                Edit Profile
              </button>

            ) : (

              <button
                type="button"
                onClick={handleFollow}
                disabled={followLoading}
                className={`
                  mt-4
                  min-w-[120px]
                  px-5
                  py-2
                  rounded-lg
                  font-medium
                  transition
                  duration-200
                  active:scale-95
                  disabled:opacity-50
                  disabled:cursor-not-allowed

                  ${
                    isFollowing
                      ? `
                        bg-[#1c1c1c]
                        text-white
                        border
                        border-white/20
                        hover:bg-[#262626]
                      `
                      : `
                        bg-white
                        text-black
                        hover:bg-white/80
                      `
                  }
                `}
              >

                {followLoading
                  ? "..."
                  : isFollowing
                  ? "Following"
                  : "Follow"}

              </button>

            )}

          </div>

        </div>

        {/* =================================================
            PROFILE TABS
        ================================================= */}

        <div className="flex gap-8 border-b border-white/10 pb-3 mb-6 text-white/60">

          <button
            type="button"
            onClick={() =>
              setActiveTab("frames")
            }
            className={
              activeTab === "frames"
                ? "text-white font-semibold"
                : "hover:text-white transition"
            }
          >
            Frames
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("snips")
            }
            className={
              activeTab === "snips"
                ? "text-white font-semibold"
                : "hover:text-white transition"
            }
          >
            Snips
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("driftlist")
            }
            className={
              activeTab === "driftlist"
                ? "text-white font-semibold"
                : "hover:text-white transition"
            }
          >
            Driftlist
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("tagged")
            }
            className={
              activeTab === "tagged"
                ? "text-white font-semibold"
                : "hover:text-white transition"
            }
          >
            Tagged
          </button>

        </div>

        {/* =================================================
            FRAMES TAB
        ================================================= */}

        {activeTab === "frames" && (
          <>
            {posts.length === 0 ? (

              <p className="text-white/40">
                No frames yet.
              </p>

            ) : (

              <div className="grid grid-cols-3 gap-4">

                {posts.map((post) => (

                  <div
                    key={post.id}
                    className="
                      relative
                      group
                      overflow-hidden
                      rounded-lg
                      bg-white/5
                    "
                  >

                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="Frame"
                        className="
                          aspect-square
                          w-full
                          object-cover
                          transition
                          duration-300
                          transform
                          group-hover:scale-110
                          group-hover:brightness-75
                        "
                      />
                    )}

                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        opacity-0
                        group-hover:opacity-100
                        transition
                      "
                    >
                      <span className="text-white text-xl">
                        👁
                      </span>
                    </div>

                  </div>

                ))}

              </div>

            )}
          </>
        )}

        {/* =================================================
            SNIPS TAB
        ================================================= */}

        {activeTab === "snips" && (
          <p className="text-white/40">
            No snips yet.
          </p>
        )}

        {/* =================================================
            DRIFTLIST TAB
        ================================================= */}

        {activeTab === "driftlist" && (
          <p className="text-white/40">
            No driftlist places yet.
          </p>
        )}

        {/* =================================================
            TAGGED TAB
        ================================================= */}

        {activeTab === "tagged" && (
          <p className="text-white/40">
            No tagged posts yet.
          </p>
        )}

      </div>

      {/* =====================================================
          FOLLOWERS / FOLLOWING MODAL
      ===================================================== */}

      {showUserList && (

        <div
          className="
            fixed
            inset-0
            z-[999]
            bg-black/70
            backdrop-blur-sm
            flex
            items-center
            justify-center
            px-4
          "
          onClick={() =>
            setShowUserList(false)
          }
        >

          <div
            className="
              w-full
              max-w-md
              max-h-[550px]
              bg-[#111]
              border
              border-white/10
              rounded-2xl
              overflow-hidden
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                px-5
                py-4
                border-b
                border-white/10
              "
            >

              <h2 className="text-lg font-semibold">
                {userListTitle}
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowUserList(false)
                }
                className="
                  text-white/50
                  hover:text-white
                  text-2xl
                  transition
                "
              >
                ×
              </button>

            </div>

            {/* USER LIST */}

            <div className="overflow-y-auto max-h-[470px]">

              {listLoading ? (

                <p className="text-center text-white/40 py-10">
                  Loading...
                </p>

              ) : userList.length === 0 ? (

                <p className="text-center text-white/40 py-10">
                  No users yet.
                </p>

              ) : (

                userList.map((user) => (

                  <button
                    type="button"
                    key={user.id}
                    onClick={() =>
                      openUserProfile(user.id)
                    }
                    className="
                      w-full
                      flex
                      items-center
                      gap-4
                      px-5
                      py-4
                      text-left
                      hover:bg-white/5
                      transition
                    "
                  >

                    {/* USER PHOTO */}

                    <div
                      className="
                        w-12
                        h-12
                        rounded-full
                        bg-white/10
                        overflow-hidden
                        flex-shrink-0
                      "
                    >

                      {user.photoURL ? (

                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <div
                          className="
                            w-full
                            h-full
                            flex
                            items-center
                            justify-center
                            font-semibold
                            text-white/50
                          "
                        >

                          {(
                            user.fullName ||
                            user.name ||
                            user.username ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()}

                        </div>

                      )}

                    </div>

                    {/* USER DETAILS */}

                    <div className="min-w-0">

                      <p className="font-medium truncate">

                        {user.fullName ||
                          user.name ||
                          user.username ||
                          "User"}

                      </p>

                      {user.username && (

                        <p className="text-sm text-white/40 truncate">
                          @{user.username}
                        </p>

                      )}

                    </div>

                  </button>

                ))

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}