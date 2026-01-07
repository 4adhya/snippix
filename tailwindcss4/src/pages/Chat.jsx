import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const currentUser = auth.currentUser;

  // 🔹 Fetch users
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs
        .map(doc => ({ uid: doc.id, ...doc.data() }))
        .filter(u => u.uid !== currentUser.uid);
      setUsers(list);
    };

    fetchUsers();
  }, [currentUser]);

  // 🔹 Chat ID (same for both users)
  const chatId =
    selectedUser &&
    [currentUser.uid, selectedUser.uid].sort().join("_");

  // 🔹 Listen to messages
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [chatId]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!text.trim() || !chatId) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      senderId: currentUser.uid,
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  // 🔹 Enter key handler
  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      
      {/* LEFT SIDEBAR */}
      <div className="w-[360px] border-r border-white/10">
        <h1 className="text-xl font-semibold px-4 py-4 border-b border-white/10">
          Messages
        </h1>

        {users.map(user => (
          <div
            key={user.uid}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/10
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

      {/* RIGHT CHAT */}
      <div className="flex-1 flex flex-col">
        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
                {selectedUser.fullName?.[0]}
              </div>
              <div>
                <p className="font-medium">{selectedUser.fullName}</p>
                <p className="text-sm text-gray-400">@{selectedUser.username}</p>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`max-w-[70%] px-3 py-2 rounded
                    ${
                      msg.senderId === currentUser.uid
                        ? "bg-blue-600 ml-auto"
                        : "bg-white/10"
                    }
                  `}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="px-4 py-3 border-t border-white/10 flex gap-3">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-1 bg-blue-600 rounded"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
