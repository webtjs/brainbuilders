"use client";

import "./flip-card.css";
import { Typography } from "@mui/material";
import Card from "./(card)/card";
import CardMedia from "./(card)/cardmedia";
import { CSSTransition } from "react-transition-group";
import "./test.css";
import { auth, db } from "@/config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";

/**
 * Practice page for users to review the flashcards in their deck
 *
 * @param params Parameters from the url. In this case, the deck name from the
 * url is passed as one of the parameters.
 */
export default function Practice({ params }: any) {
  const isMounted = useRef(false);
  // User states
  const [userId, setUserId] = useState("");
  const [haveUser, setHaveUser] = useState(true);
  // Deck states
  const deckId = params.deckId;
  const [flashcardList, setFlashcardList] = useState<{ id: string }[]>([]);

  // Flashcard states
  const [activeFlashcard, setActiveFlashcard] = useState(0);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState<any>({});
  // Type flashcard states
  const [submitted, setSubmitted] = useState(false);
  const [answer, setAnswer] = useState("");
  // Flashcard display state
  const [showFront, setShowFront] = useState(true);

  const submitAns = () => {
    setSubmitted((prev) => !prev);
  };

  // Fetches the list of flashcards on mount
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        const getFlashcardList = async () => {
          try {
            const flashcardListRef = collection(
              db,
              user.uid,
              deckId,
              "flashcards"
            );
            const data = await getDocs(flashcardListRef);
            if (data.empty) {
              setReviewComplete(true);
            } else {
              const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));
              setFlashcardList(filteredData);
              console.log(filteredData);
              setCurrentFlashcard(filteredData[activeFlashcard]);
            }
          } catch (err) {
            console.error(err);
          }
        };
        getFlashcardList();
      }
    });
  }, []);

  /** Sets currentFlashcard to the corresponding array element based on activeFlashcard
      The isMounted variable is used to prevent the function from running on mount
   */
  useEffect(() => {
    if (isMounted.current) {
      setCurrentFlashcard(flashcardList[activeFlashcard]);
    } else {
      isMounted.current = true;
    }
  }, [activeFlashcard]);

  // Function to increment activeFlashcard when "Next" button is pressed
  const nextFlashcard = () => {
    if (activeFlashcard !== flashcardList.length - 1) {
      setActiveFlashcard((prev) => prev + 1);
      if (currentFlashcard.type == "type") {
        setSubmitted((prev) => !prev);
      }
      if (showFront == false) {
        setShowFront(true);
      }
    } else {
      setActiveFlashcard(0);
      setReviewComplete(true);
    }
  };

  return (
    <div className="App">
      <div>
        <h1>Review Page</h1>
        {!reviewComplete ? (
          <div>
            <h2>
              Flashcard: {activeFlashcard + 1}
              <span>/{flashcardList.length}</span>
            </h2>
            <div className="flip-card-container">
              {!currentFlashcard.media ? (
                <CSSTransition in={showFront} timeout={300} classNames="flip">
                  <Card currentFlashcard={currentFlashcard} />
                </CSSTransition>
              ) : (
                <CSSTransition in={showFront} timeout={300} classNames="flip">
                  <CardMedia currentFlashcard={currentFlashcard} />
                </CSSTransition>
              )}
            </div>
            <br />
            <div>
              {currentFlashcard.type == "type" ? (
                <div>
                  {!submitted ? (
                    <form onSubmit={submitAns}>
                      <input
                        placeholder="Answer..."
                        type="answer"
                        onChange={(event) => setAnswer(event.target.value)}
                      />
                      <button type="submit">Submit</button>
                    </form>
                  ) : (
                    <div>
                      <button
                        onClick={() => {
                          setShowFront((prev) => !prev);
                        }}
                      >
                        Flip flashcard
                      </button>
                      <button onClick={nextFlashcard}>
                        {activeFlashcard === flashcardList.length - 1
                          ? "Finish"
                          : "Next"}
                      </button>
                      {answer.toLowerCase() ==
                      currentFlashcard.back.toLowerCase() ? (
                        <Typography color="lightgreen">Correct!</Typography>
                      ) : (
                        <Typography color="crimson">Wrong...</Typography>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => {
                      setShowFront((prev) => !prev);
                    }}
                  >
                    Flip flashcard
                  </button>
                  <button onClick={nextFlashcard}>
                    {activeFlashcard === flashcardList.length - 1
                      ? "Finish"
                      : "Next"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>Review complete</div>
        )}
        <br />
        <a href="/main-page">Back to home</a>
      </div>
    </div>
  );
}
