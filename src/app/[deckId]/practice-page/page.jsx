"use client";

import "./practice-page.css";
import Splitbutton from "./split_button.tsx";
import FlashcardList from "./flashcard_list";
import { auth, db } from "@/config/firebase";
import { getDocs, collection, query, where, getCountFromServer } from "firebase/firestore";
import ButtonGroup from '@mui/material/ButtonGroup';

import {useState, useEffect} from "react";
import Button from "@mui/material/Button";

export default function page({deckId}) {
    const reviewLink = "/" + deckId + "/practice";


    const SAMPLE_FLASHCARDS = [
        {
            id: 1,
            question: "what is 2 + 2?",
            answer: "4",
        },
    ];

    const [flashcards, setFlashcards] = useState(SAMPLE_FLASHCARDS)
    const [name, setName] = useState("somedeck");
    const [number, setNumber] = useState(0);

    const cardCollectionRef = collection(db, "flashcards");
    const q = query(cardCollectionRef, where("review", "==", 1));
    const q1 = query(cardCollectionRef, where("level", "==", 1));
    const q2 = query(cardCollectionRef, where("level", "==", 2));

    const [cardCollection, setCardCollection] = useState(q);

    const getCount_order = async () => {
        const snapshot = await getCountFromServer(q);
        const snapshot1 = await getCountFromServer(q1);
        const snapshot2 = await getCountFromServer(q2);
        const q_count = snapshot.data().count;
        const q1_count = snapshot1.data().count;
        const q2_count = snapshot2.data().count;
        if (q_count == 0 && q1_count != 0) {
            console.log("q empty");
            const data = await getDocs(q1);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            console.log(q1_count);
            setFlashcards(filteredData);
        }  else if (q1_count == 0) {
            console.log("q1 empty");
            const data = await getDocs(q2);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setFlashcards(filteredData);
            console.log(q2_count);
        }
    };

    if (number == 0) {
        getCount_order();
    };

    const handle_new = async () => {
        const data = await getDocs(q);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
        setFlashcards(filteredData);
        setNumber(1);
        console.log(number);
    };

    const handle_easy = async () => {
        const data = await getDocs(q1);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
        setFlashcards(filteredData);
        setNumber(2);
        console.log(number);
    };

    const handle_hard = async () => {
        const data = await getDocs(q2);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
        setFlashcards(filteredData);
        setNumber(1);
        console.log(number);
    };

    useEffect(() => {
        const getFlashcard = async () => {
            //Get flashcard data
            try {
            const data = await getDocs(cardCollection);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setFlashcards(filteredData);
            } catch (err) {
                console.error(err);
            }
        };
        getFlashcard();
    }, []);

    const data = getDocs(cardCollectionRef);

  return (
    <div className="box">
    <h2>Currently reviewing flashcards for {name}</h2>
    <h4>Select type of cards</h4>
    <ButtonGroup
      disableElevation
      variant="outlined"
    >
      <Button onClick={() => window.location.reload()}>Default</Button>
      <Button onClick={handle_new}>Cards not reviewed</Button>
      <Button onClick={handle_easy}>level: easy</Button>
      <Button onClick={handle_hard}>level: hard</Button>
    </ButtonGroup>
    <br></br> <br></br>
    <h4>Cards list</h4>
    <FlashcardList data={flashcards}/>
    <Button variant="outlined" href={"/main-page"}>Back</Button>
    </div>
  )
}
