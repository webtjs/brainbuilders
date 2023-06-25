"use client";

import "./style1.css";
import Banner from "./Banner";
import DeckList from "./DeckList";
import AccountMenu from "./Account";
import { CssBaseline, Container } from "@mui/material";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

export default function app() {
  const [haveUser, setHaveUser] = useState(true);
  const [userId, setUserId] = useState("");

  const logOut = async () => {
    await signOut(auth)
      .then(() => {
        setHaveUser(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setHaveUser(true);
      setUserId(user.uid);
      console.log(user.uid);
    } else {
      setHaveUser(false);
    }
  });

  if (!haveUser) {
    redirect("/");
  }

  return (
    <main>
      <div className="App">
        <Banner />
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
