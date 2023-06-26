import DeckCard from "./DeckCard";
import { auth, db } from "@/config/firebase";
import { useEffect, useState } from "react";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Grid } from "@mui/material";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";

export default function DeckList() {
  const [deckList, setDeckList] = useState<{ id: string }[]>([]);
  const [dmOpen, setDmOpen] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [userId, setUserId] = useState("");

  const submitDeck = () => {
    setDmOpen(false);
    if (deckName == "") return;
    const deckRef = doc(db, userId, deckName);
    setDoc(deckRef, { dummy: "value" }, { merge: true });
    console.log(deckName);
    window.location.reload();
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        const getDeckList = async () => {
          try {
            console.log(user.uid);
            const deckListRef = collection(db, user.uid); // A reference to the collection in firebase
            const data = await getDocs(deckListRef); // Get all the documents from the collection based on the user id
            const filteredData = data.docs.map((doc) => ({
              // Get the data we are interested in (mainly the deck name which is doc.id)
              ...doc.data(),
              id: doc.id,
            }));
            setDeckList(filteredData);
            console.log(filteredData);
          } catch (err) {
            console.error(err);
          }
        };
        getDeckList();
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
        {deckList.map((deck) => (
          <Grid item xs={3} md={2.4} lg={2} key={deck.id}>
            <DeckCard deckId={deck.id}></DeckCard>
          </Grid>
        ))}
        <Grid item xs={3} md={2.4} lg={2}>
          <Button
            variant="contained"
            onClick={() => {
              setDmOpen(true);
            }}
          >
            Create new deck
          </Button>
          <Dialog
            open={dmOpen}
            onClose={() => {
              setDmOpen(false);
            }}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Create new deck</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Deck name"
                variant="standard"
                fullWidth
                onChange={(event) => {
                  setDeckName(event.target.value);
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={submitDeck}>Submit</Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
}
