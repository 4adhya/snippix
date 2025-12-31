import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import ProfileCard from "../components/ProfileCard";

export default function ProfileScroll() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));

      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // remove logged-in user
      const filtered = fetchedUsers.filter(
        user => user.uid !== auth.currentUser?.uid
      );

      setUsers(filtered);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-white text-2xl font-bold mb-6">
        Creative Profiles
      </h1>

      {users.length === 0 ? (
        <p className="text-gray-400">
          No other users yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users.map(user => (
            <ProfileCard key={user.id} userData={user} />
          ))}
        </div>
      )}
    </div>
  );
}
