"use client";

import Banner from "./Banner";
import FlashcardList from "./FlashcardList";
import Link from "next/link";
import { db } from "@/config/firebase";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";

/**
 * Displays all the flashcards present in the deck
 *
 * @param[in] params The parameters passed from the url
 */
export default function DeckPage({ params }: any) {
  const deckId = params.deckId;
  const [flashcardList, setFlashcardList] = useState<{ id: string }[]>([]);
  const flashcardListRef = collection(db, "user-id", deckId, "flashcards");

  useEffect(() => {
    const getFlashcardList = async () => {
      try {
        const data = await getDocs(flashcardListRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setFlashcardList(filteredData);
        console.log(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    getFlashcardList();
  }, []);

  return (
    <div style={{ textAlign: "center", justifyContent: "center" }}>
      <Banner deckId={deckId} />
      <br />
      <div>
        <FlashcardList deckId={deckId} />
      </div>
      <br />
      <Link href={"/main-page"}>Back to home</Link>
    </div>
  );
}
