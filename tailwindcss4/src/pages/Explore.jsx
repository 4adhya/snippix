import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import ProfileCard from "../components/ProfileCard";

export default function Explore() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));

      const allUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // REMOVE CURRENT USER
      const filtered = allUsers.filter(
        user => user.uid !== auth.currentUser?.uid
      );

      setUsers(filtered);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Explore Creators</h1>

      {users.length === 0 ? (
        <p>No other users found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {users.map(user => (
            <ProfileCard key={user.uid} userData={user} />
          ))}
        </div>
      )}
    </div>
  );
}
