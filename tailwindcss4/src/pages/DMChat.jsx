import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function DMChat() {
  const { uid } = useParams(); // other user's uid
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const currentUser = auth.currentUser;
  const otherUid = uid;

  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // SAFETY: wait for auth
  if (!currentUser) return null;

  const chatId = [currentUser.uid, otherUid].sort().join("_");

  // Load other user
  useEffect(() => {
    const loadUser = async () => {
      const snap = await getDoc(doc(db, "users", otherUid));
      if (snap.exists()) {
        setOtherUser(snap.data());
      }
    };
    loadUser();
  }, [otherUid]);

  // Listen to messages
  useEffect(() => {
    const chatRef = doc(db, "chats", chatId);

    setDoc(
      chatRef,
      {
        participants: [currentUser.uid, otherUid],
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [chatId, currentUser.uid, otherUid]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      senderId: currentUser.uid,
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!otherUser) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
          {otherUser.fullName?.[0]}
        </div>
        <p className="font-semibold">{otherUser.fullName}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[70%] px-4 py-2 rounded-xl ${
              msg.senderId === currentUser.uid
                ? "ml-auto bg-blue-600"
                : "bg-white/10"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message…"
          className="flex-1 bg-white/10 rounded-xl px-4 py-2 outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>
          <Send />
        </button>
      </div>
    </div>
  );
}
