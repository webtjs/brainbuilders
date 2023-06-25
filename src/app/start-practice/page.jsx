"use client";

import { db } from "@/config/firebase";
import { useEffect, useState } from "react";
import {getDocs, collection} from "firebase/firestore";

export default function app() {

const [answer, getAnswer] = useState([]);

const answerDisplay = collection(db, "flashcards"); 

useEffect( () => {
    const showAnswer = async () => {
        //READ data from database
        try {
        const data = await getDocs(answerDisplay);
        const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id,}));
        getAnswer(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    showAnswer();
}, []
);


    return (
        <div className="practice">
        <h2>No pain, no gain</h2>
        {answer.map((flashcards) => (
            <div>
                <h2>{flashcards.Front}</h2>
                <br></br>
                <h3>Please input your answer</h3>
                <p>{flashcards.Back}</p>
                </div>
        )
        )

        }
        <a href="/main-page">Back to Home</a>
        </div>

    );
}