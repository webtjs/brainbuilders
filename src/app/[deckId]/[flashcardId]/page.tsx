"use client";

import Link from "next/link";
//Import from MaterialUI for aesthetic purposes
import Button from "@mui/material/Button";

//Access data from other places
import "../create-cards/style2.css";
import { auth, db } from "@/config/firebase";
import { useEffect, useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { redirect } from "next/navigation";

export default function EditFlashcard({ params }: any) {
  //New flashcards
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [type, setType] = useState("flip");
  const [level, setLevel] = useState(1);
  // User states
  const [userId, setUserId] = useState("");
  const [haveUser, setHaveUser] = useState(true);
  const deckId = params.deckId;
  const flashcardId = params.flashcardId;

  const updateCard = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const flashcardRef = doc(db, userId, deckId, "flashcards", flashcardId);
    try {
      await updateDoc(flashcardRef, {
        front: front,
        back: back,
      }).then(() => {
        window.location.reload();
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
        const flashcardRef = doc(
          db,
          user.uid,
          deckId,
          "flashcards",
          flashcardId
        );
        const getFlashcard = async () => {
          const docSnap = await getDoc(flashcardRef);
          if (!docSnap.exists()) return;
          setFront(docSnap.data().front);
          setBack(docSnap.data().back);
        };
        getFlashcard();
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
      <h2>This is where you edit the flashcard</h2>

      <form onSubmit={updateCard}>
        <p> Flashcard Front</p>
        <textarea
          style={textstyle}
          typeof="text"
          cols={70}
          rows={10}
          placeholder="input the question"
          defaultValue={front}
          onChange={(e) => setFront(e.target.value)}
        />
        <p> Flashcard Back </p>
        <textarea
          style={textstyle}
          typeof="text"
          cols={70}
          rows={10}
          placeholder="input the answers"
          defaultValue={back}
          onChange={(e) => setBack(e.target.value)}
        />
        <br />
        <Button variant="outlined" type="submit">
          Save changes
        </Button>
      </form>
      <br></br>
      <hr></hr>
      <Link href={"/" + deckId}>Back to edit deck</Link>
    </div>
  );
}
