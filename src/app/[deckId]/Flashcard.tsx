"use client";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useState } from "react";

/**
 * Displays the contents of a flashcard in a mui card component which has
 * two features, edit flashcard and delete flashcard
 *
 * @param[in] flashcard A dictionary containing information about a flashcard
 */
export default function Flashcard({ flashcard, userId, deckId }: any) {
  const flashcardId = flashcard.id;
  console.log(flashcardId);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    const deleteRef = doc(db, userId, deckId, "flashcards", flashcardId);
    await deleteDoc(deleteRef)
      .then(() => {
        setOpen(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Card sx={{ maxWidth: 245 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Front: {flashcard.front}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          Back: {flashcard.back}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          Type: {flashcard.type}
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={"/" + deckId + "/" + flashcardId}>
          <Button size="small">Edit flashcard</Button>
        </Link>
        <Button size="small" onClick={handleClickOpen}>
          Delete flashcard
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete flashcard?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure that you want to delete this flashcard?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              No
            </Button>
            <Button onClick={handleClose} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </CardActions>
    </Card>
  );
}
