import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Chat() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs
        .map(doc => ({ uid: doc.id, ...doc.data() }))
        .filter(u => u.uid !== currentUser.uid);
      setUsers(list);
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <h1 className="text-xl font-semibold px-4 py-4 border-b border-white/10">
        Messages
      </h1>

      {users.map(user => (
        <div
          key={user.uid}
          onClick={() => navigate(`/dm/${user.uid}`)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            {user.fullName?.[0]}
          </div>
          <div>
            <p className="font-medium">{user.fullName}</p>
            <p className="text-sm text-gray-400">@{user.username}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
