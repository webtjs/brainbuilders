"use client";

import "./practice-page.css";
import FlashcardList from "./flashcard_list";
import { auth, db } from "@/config/firebase";
import { getDocs, collection, query, where, or } from "firebase/firestore";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";

export default function PracticePage({ params }: any) {
  const router = useRouter();

  const SAMPLE_FLASHCARDS = [
    {
      id: "flashcard-id",
      question: "what is 2 + 2?",
      answer: "4",
    },
  ];

  //set the state 
  const [flashcards, setFlashcards] = useState<any>(SAMPLE_FLASHCARDS);
  const [newFlashcards, setNewFlashcards] = useState<any>(SAMPLE_FLASHCARDS);
  const [easyFlashcards, setEasyFlashcards] = useState<any>(SAMPLE_FLASHCARDS);
  const [hardFlashcards, setHardFlashcards] = useState<any>(SAMPLE_FLASHCARDS);
  const [buttonVarNew, setButtonVarNew] = useState<any>("contained");
  const [buttonVarEasy, setButtonVarEasy] = useState<any>("outlined");
  const [buttonVarHard, setButtonVarHard] = useState<any>("outlined");
  const [userId, setUserId] = useState("");
  const name = params.deckId;
  const [number, setNumber] = useState(0);

  /**
   * Display all of the unreviewed flashcards
   */
  const handle_new = async () => {
    setFlashcards(newFlashcards);
    setButtonVarNew("contained");
    setButtonVarEasy("outlined");
    setButtonVarHard("outlined");
    setNumber(1);
    console.log(number);
  };

  /**
   * Display all of the flashcards whose level is easy
   */
  const handle_easy = async () => {
    setFlashcards(easyFlashcards);
    setButtonVarNew("outlined");
    setButtonVarEasy("contained");
    setButtonVarHard("outlined");
    setNumber(2);
    console.log(number);
  };

  /**
   * Display all of the flashcards whose level is hard
   */
  const handle_hard = async () => {
    setFlashcards(hardFlashcards);
    setButtonVarNew("outlined");
    setButtonVarEasy("outlined");
    setButtonVarHard("contained");
    setNumber(1);
    console.log(number);
  };

  /**
   * Filter the flashcards displayed based on the filtered result
   * 
   * @return display the front side of the front card being displayed
   */
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
        return;
      }
      setUserId(user.uid);
      const getFlashcard = async () => {
        //Get flashcard data
        try {
          const cardsRef = collection(db, user.uid, name, "flashcards");
          const dataNew = await getDocs(
            query(
              cardsRef,
              or(where("review", "==", 1), where("review", "==", "1"))
            )
          );
          const filteredData = dataNew.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setFlashcards(filteredData);
          setNewFlashcards(filteredData);
          const dataEasy = await getDocs(
            query(
              cardsRef,
              or(where("level", "==", 1), where("level", "==", "1"))
            )
          );
          const filteredDataEasy = dataEasy.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setEasyFlashcards(filteredDataEasy);
          const dataHard = await getDocs(
            query(
              cardsRef,
              or(where("level", "==", 2), where("level", "==", "2"))
            )
          );
          const filteredDataHard = dataHard.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setHardFlashcards(filteredDataHard);
        } catch (err) {
          console.error(err);
        }
      };
      getFlashcard();
    });
  }, []);

  return (
    <div className="box">
      <h2>Currently reviewing flashcards for {name}</h2>
      <h4>Select type of cards</h4>
      <ButtonGroup disableElevation variant="outlined">
        <Button onClick={handle_new} variant={buttonVarNew}>
          Cards not reviewed
        </Button>
        <Button onClick={handle_easy} variant={buttonVarEasy}>
          level: easy
        </Button>
        <Button onClick={handle_hard} variant={buttonVarHard}>
          level: hard
        </Button>
      </ButtonGroup>
      <br></br> <br></br>
      <h4>Cards list</h4>
      <FlashcardList data={flashcards} deckId={name} />
      <Button variant="outlined" href={"/main-page"}>
        Back
      </Button>
    </div>
  );
}
