import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "../firebase";

export default function ChangePassword() {
  const [password, setPassword] = useState("");

  const change = async () => {
    await updatePassword(auth.currentUser, password);
    alert("Password updated");
  };

  return (
    <div className="p-6">
      <h2>Change Password</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={change}>Update</button>
    </div>
  );
}
