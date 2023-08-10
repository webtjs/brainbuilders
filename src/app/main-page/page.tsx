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

export default function MainPage() {
  const [haveUser, setHaveUser] = useState(true);
  const [username, setUsername] = useState("Guest");

  /**
   * Enable user to be logged out when lotout button is clicked
   */
  const logOut = async () => {
    await signOut(auth)
      .then(() => {
        setHaveUser(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * Display all of the current flashcard decks
   * 
   * @return Display the deckID of each deck
   */
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
          <AccountMenu haveUser={haveUser} />
        </div>
        <Container maxWidth="lg">
          <DeckList />
        </Container>
      </div>
    </main>
  );
}
