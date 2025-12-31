import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function EditProfile() {
  const [name, setName] = useState("");

  useEffect(() => {
    if (auth.currentUser) setName(auth.currentUser.displayName || "");
  }, []);

  const save = async () => {
    await updateProfile(auth.currentUser, { displayName: name });
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      fullName: name,
    });
    alert("Profile updated");
  };

  return (
    <div className="p-6">
      <h2>Edit Profile</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={save}>Save</button>
    </div>
  );
}
