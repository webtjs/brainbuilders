"use client";

import "./style1.css";
import FlashcardBuilder from "./FlashcardBuilder";
import Banner from "./Banner";
import { CSSBaseLine, Container } from "@mui/material";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function app() {
  const [haveUser, setHaveUser] = useState(true);

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
          <Container maxWidth="sm">
            <FlashcardBuilder />
          </Container>
          <button onClick={logOut}>Sign out</button>
        </div>
      </main>
    );
  }

