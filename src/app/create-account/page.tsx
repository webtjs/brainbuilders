"use client";

import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [haveUser, setHaveUser] = useState(false);

  const signUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password).catch((err) => {
      console.log(err);
    });
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setHaveUser(true);
    }
  });

  if (haveUser) {
    redirect("/home");
  }

  return (
    <div className="sign-up-container">
      <h1>BrainBuilders</h1>
      <h2>Create an account</h2>
      <form onSubmit={signUp}>
        <label htmlFor="fname">Email:</label>
        <br />
        <input
          placeholder="Email..."
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="lname">Password:</label>
        <br />
        <input
          placeholder="Password..."
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Sign up</button>
      </form>
      <a href="/">Login page</a>
    </div>
  );
}
