import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) return;

      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs
        .map(doc => ({ uid: doc.id, ...doc.data() }))
        .filter(u => u.uid !== currentUser.uid);

      setUsers(list);
    };

    fetchUsers();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-black text-white flex">
      
      {/* LEFT – USER LIST */}
      <div className="w-[360px] border-r border-white/10">
        <h1 className="text-xl font-semibold px-4 py-4 border-b border-white/10">
          Messages
        </h1>

        {users.map(user => (
          <div
            key={user.uid}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer
              hover:bg-white/10
              ${selectedUser?.uid === user.uid ? "bg-white/10 border-l-2 border-blue-500" : ""}
            `}
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
              {user.fullName?.[0]}
            </div>

            <div>
              <p className="font-medium">{user.fullName}</p>
              <p className="text-sm text-gray-400">@{user.username}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT – CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        ) : (
          <>
            {/* CHAT HEADER */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
                {selectedUser.fullName?.[0]}
              </div>
              <div>
                <p className="font-medium">{selectedUser.fullName}</p>
                <p className="text-sm text-gray-400">@{selectedUser.username}</p>
              </div>
            </div>

            {/* MESSAGES (dummy for now) */}
            <div className="flex-1 px-6 py-4 text-gray-400">
              No messages yet.
            </div>

            {/* INPUT */}
            <div className="px-4 py-3 border-t border-white/10">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full bg-transparent outline-none text-white placeholder-gray-500"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
