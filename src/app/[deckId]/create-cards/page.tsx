"use client";

import Link from "next/link";
//Import from MaterialUI for aesthetic purposes
import Button from "@mui/material/Button";

//Access data from other places
import "./style2.css";
import { auth, db } from "@/config/firebase";
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { redirect } from "next/navigation";

export default function app({ params }: any) {
  //New flashcards
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [type, setType] = useState("flip");
  const [level, setLevel] = useState(1);
  // User states
  const [userId, setUserId] = useState("");
  const [haveUser, setHaveUser] = useState(true);
  const deckId = params.deckId;

  const sumbitCards = async () => {
    const answerDisplay = collection(db, userId, deckId, "flashcards");
    try {
      await addDoc(answerDisplay, {
        front: front,
        back: back,
        type: type,
        level: level,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const textstyle = {
    fontFamily: "Arial",
    fontSize: "25px",
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setHaveUser(false);
      }
    });
  }, []);

  if (!haveUser) {
    redirect("/");
  }

  return (
    <div className="page">
      <h2>This is where you create your own flashcards</h2>

      <form onSubmit={sumbitCards}>
        <p> Flashcard Front</p>
        <textarea
          style={textstyle}
          typeof="text"
          cols={70}
          rows={10}
          placeholder="input the question"
          onChange={(e) => setFront(e.target.value)}
        />
        <p> Flashcard Back </p>
        <textarea
          style={textstyle}
          typeof="text"
          cols={70}
          rows={10}
          placeholder="input the answers"
          onChange={(e) => setBack(e.target.value)}
        />
        <br />
        <Button variant="outlined" type="submit">
          Add
        </Button>
      </form>
      <br></br>
      <hr></hr>
      <Link href={"/" + deckId}>Back to Edit flashcard</Link>
    </div>
  );
}
