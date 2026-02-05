import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { getChatId } from "../utils/getChatId";

export default function DMChat({ currentUser, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // 🛑 No self chat
  if (!selectedUser || selectedUser.uid === currentUser.uid) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  const chatId = getChatId(currentUser.uid, selectedUser.uid);

  // 📩 Fetch messages
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, [chatId]);

  // ✉️ Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      senderId: currentUser.uid,
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* HEADER */}
      <div className="border-b border-neutral-800 px-4 py-3 font-medium">
        {selectedUser.name || selectedUser.username}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-gray-500 text-sm text-center mt-10">
            No messages yet. Say hi 👋
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
              msg.senderId === currentUser.uid
                ? "ml-auto bg-blue-600"
                : "bg-neutral-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="border-t border-neutral-800 p-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message…"
          className="flex-1 bg-neutral-900 rounded px-3 py-2 text-sm outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
