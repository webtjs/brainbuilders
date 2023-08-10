import Flashcard from "./Flashcard";
import Link from "next/link";
import { auth, db } from "@/config/firebase";
import { useEffect, useState } from "react";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Grid, Button } from "@mui/material";

export default function FlashcardList({ deckId }: { deckId: string }) {
  const [userId, setUserId] = useState("");
  const [flashcardList, setFlashcardList] = useState<{ id: string }[]>([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        /**
         * Get the flashcards data from Firebase
         */
        const getFlashcardList = async () => {
          try {
            const flashcardListRef = collection(
              db,
              user.uid,
              deckId,
              "flashcards"
            );
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
      }
    });
  }, []);

  return (
    <div>
      <Grid
        container
        spacing={3}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {flashcardList.map((flashcard) => (
          <Grid item xs={3} md={2.4} lg={2} key={flashcard.id}>
            <Flashcard flashcard={flashcard} userId={userId} deckId={deckId} />
          </Grid>
        ))}
        <Grid item xs={3} md={2.4} lg={2}>
          <Link href={"/" + deckId + "/create-cards"}>
            <Button variant="contained">Add new flashcard</Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}
