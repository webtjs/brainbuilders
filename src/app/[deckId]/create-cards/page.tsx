"use client";

import Link from "next/link";
//Import from MaterialUI for aesthetic purposes
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

//Access data from other places
import "./style2.css";
import { auth, db } from "@/config/firebase";
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { redirect } from "next/navigation";

export default function CreateCards({ params }: any) {
  //New flashcards
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [type, setType] = useState("flip");
  const [level, setLevel] = useState(1);
  const [review, setReview] = useState(1);
  // User states
  const [userId, setUserId] = useState("");
  const [haveUser, setHaveUser] = useState(true);
  const [lev, setLev] = useState("Easy");
  const [inputError, setInputError] = useState("");
  const deckId = params.deckId;

  const sumbitCards = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const answerDisplay = collection(db, userId, deckId, "flashcards");
    if (front != "" && back != "") {
      try {
        await addDoc(answerDisplay, {
          front: front,
          back: back,
          type: type,
          level: level,
          review: review,
        }).then(() => {
          window.location.reload();
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      setInputError("please input something inside both textbox");
    }
  };

  const textstyle = {
    fontFamily: "Arial",
    fontSize: "25px",
  };

  function setDifficulty() {
    if (lev == "Easy" && level != 1) {
      setLevel(2);
    }
  }
  setDifficulty();

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

      <form className="form_to_sub" onSubmit={sumbitCards}>
        <h3>Difficulty level</h3>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="Easy"
            name="radio-buttons-group"
            onChange={(e) => {
              setLev(e.target.value);
              if (e.target.value == "Easy") setLevel(1);
              else setLevel(2);
            }}
          >
            <FormControlLabel value="Easy" control={<Radio />} label="Easy" />
            <FormControlLabel value="Hard" control={<Radio />} label="Hard" />
          </RadioGroup>
        </FormControl>
        <p> Flashcard Front</p>
        <textarea
          style={textstyle}
          typeof="text"
          cols={40}
          rows={10}
          placeholder="input the question"
          onChange={(e) => setFront(e.target.value)}
        />
        <p> Flashcard Back </p>
        <textarea
          style={textstyle}
          typeof="text"
          cols={40}
          rows={10}
          placeholder="input the answers"
          onChange={(e) => setBack(e.target.value)}
        />
        <br />
        <Button variant="outlined" type="submit">
          Add
        </Button>
      </form>
      {inputError && <div className="error">{inputError}</div>}
      <br></br>
      <hr></hr>
      <Link href={"/" + deckId}>Back to Edit flashcard</Link>
    </div>
  );
}
