"use client";

import "./style1.css";
import Banner from "./Banner";
import DeckList from "./DeckList";
import AccountMenu from "./Account";
import { Container } from "@mui/material";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * Main page of the application
 */
export default function MainPage() {
  const [haveUser, setHaveUser] = useState(true);
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setHaveUser(false);
        return;
      }
      setHaveUser(true);
      const profileRef = doc(db, user.uid, "profile");
      const profileData = (await getDoc(profileRef)).data();
      if (profileData) setUsername(profileData.username);
    });
  }, []);

  if (!haveUser) {
    redirect("/");
  }

  return (
    <main>
      <div className="App">
        <Banner username={username} />
        <div className="user">
          <AccountMenu haveUser={haveUser} username={username} />
        </div>
        <Container maxWidth="lg">
          <DeckList />
        </Container>
      </div>
    </main>
  );
}
