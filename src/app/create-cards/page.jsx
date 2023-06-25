"use client";

//Import from MaterialUI for aesthetic purposes
import  Button from "@mui/material/Button";

//Access data from other places
import "./style2.css";
import { db } from "@/config/firebase"
import {useEffect, useState} from "react";
import {addDoc, collection} from "firebase/firestore";

export default function app() {

    //New flashcards
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const [level, setLevel] = useState(1);

    const answerDisplay = collection(db, "flashcards");

    const sumbitCards = async () => {
        try {
        await addDoc(answerDisplay, {front: front, back:back, level:level} );
        } catch(err) {
            console.error(err);
        }
    };

    const textstyle = {
        fontFamily: "Arial",
        fontSize: "25px"
    };

    return (
        <div className="page">

        <h2>This is where you create your own flashcards</h2>

    <form onSubmit={ sumbitCards }>
    <p> Flashcard Front</p>
        <textarea style={textstyle} type="text" cols="70" rows="10" placeholder="input the question"
        onChange={(e) => setFront(e.target.value)}/>
     <p> Flashcard Back </p>
        <textarea style={textstyle} type="text" cols="70" rows="10" placeholder="input the answers"
        onChange={(e) => setBack(e.target.value)}/>
     <br />
     <Button variant="outlined" type="submit">Add</Button>
     </form>
    <br></br>
    <hr></hr>
    <a href="/main-page">Back to Home</a>
    </div>

    );
}