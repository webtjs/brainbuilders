"use client";

import Link from "next/link";
//Import from MaterialUI for aesthetic purposes
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// MUI imports for difficulty
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

//Access data from other places
import "../create-cards/style2.css";
import { auth, db, storage } from "@/config/firebase";
import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { redirect } from "next/navigation";

export default function EditFlashcard({ params }: any) {
  //New flashcards
  const [front, setFront] = useState("");
  const [frontMedia, setFrontMedia] = useState<File | null>(null);
  const [back, setBack] = useState("");
  const [backMedia, setBackMedia] = useState<File | null>(null);
  const [type, setType] = useState("flip");
  const [level, setLevel] = useState(1);
  const [lev, setLev] = useState("Easy");
  const [review, setReview] = useState(1);
  // User states
  const [userId, setUserId] = useState("");
  const [haveUser, setHaveUser] = useState(true);
  const deckId = params.deckId;
  const flashcardId = params.flashcardId;

  /**
   * Set the type for the flashcards stored in Firebase
   * 
   * @param[in] input The type of flashcards selected
   */
  const typeChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  /**
   * Upload the link of the media into corresponding places inside Firebase
   * 
   * @param[in] media The link for the media uploaded
   * @param flashcardId The id of the flashcards inside Firebase
   * @param[in] side Whether this media is uploaded to the front or back side of the Falshcard
   * @returns Store the media into Firebase
   */
  const mediaUpload = (
    media: File | null,
    flashcardId: string,
    side: string
  ) => {
    if (media == null) return;
    const mediaPath = userId + "/" + deckId + "/" + flashcardId + "/" + side;
    const mediaRef = ref(storage, mediaPath);
    const flashcardRef = doc(db, userId, deckId, "flashcards", flashcardId);
    uploadBytes(mediaRef, media)
      .then((result) => {
        getDownloadURL(result.ref).then(async (url) => {
          console.log(side);
          await updateDoc(flashcardRef, { [side]: url, media: true }).catch(
            (err) => {
              console.error(err);
            }
          );
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /**
   * Validates the input of the updated version of flashcards and store them inside Firebase
   * 
   * @pre The flashcard is already created and stored inside Firebase
   * 
   * @param[in] input The updated information inputted into the flashcards
   * @returns error message if nothing is inputted during the update
   */
  const updateCard = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (
      (front == "" && frontMedia == null) ||
      (back == "" && backMedia == null)
    ) {
      alert("Please ensure both sides have at least a text or media.");
      return;
    }
    const flashcardRef = doc(db, userId, deckId, "flashcards", flashcardId);
    try {
      await updateDoc(flashcardRef, {
        front: front,
        back: back,
        type: type,
        level: level,
        review: review,
      }).then(() => {
        mediaUpload(frontMedia, flashcardId, "frontMedia");
        mediaUpload(backMedia, flashcardId, "backMedia");
        window.location.reload();
      });
    } catch (err) {
      console.error(err);
    }
  };

  const textstyle = {
    fontFamily: "Arial",
    fontSize: "25px",
  };

  /**
   * Show all of the flashcards created in the current deck including its type
   * 
   * @pre All of the cards displayed are stored inside Firebase under a specific field with the same DeckID
   * 
   * @return The front and back side of each flashcard including its type
   */
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        const flashcardRef = doc(
          db,
          user.uid,
          deckId,
          "flashcards",
          flashcardId
        );
        const getFlashcard = async () => {
          const docSnap = await getDoc(flashcardRef);
          if (!docSnap.exists()) return;
          setFront(docSnap.data().front);
          setBack(docSnap.data().back);
          setType(docSnap.data().type);
          setLevel(docSnap.data().level);
          if (docSnap.data().level == 2) setLev("Hard");
        };
        getFlashcard();
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
      <h2>This is where you edit the flashcard</h2>
      <h3>Difficulty level</h3>
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-radio-buttons-group-label"
          value={lev}
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
      <br />
      <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
        <InputLabel id="demo-simple-select-autowidth-label">
          Flashcard type
        </InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={type}
          autoWidth
          label="Flashcard type"
          onChange={typeChange}
        >
          <MenuItem value="flip">Flip flashcard (Flip)</MenuItem>
          <MenuItem value="type">Key in answer flashcard (Type)</MenuItem>
        </Select>
      </FormControl>

      <form onSubmit={updateCard}>
        <p> Flashcard Front</p>
        <input
          type="file"
          accept="image/*, video/*"
          onChange={(event) => {
            if (!event.target.files) return;
            setFrontMedia(event.target.files[0]);
          }}
        />
        <br />
        <br />
        <textarea
          style={textstyle}
          typeof="text"
          cols={40}
          rows={10}
          placeholder="input the question"
          defaultValue={front}
          onChange={(e) => setFront(e.target.value)}
        />
        <p> Flashcard Back </p>
        <input
          type="file"
          accept="image/*, video/*"
          onChange={(event) => {
            if (!event.target.files) return;
            setBackMedia(event.target.files[0]);
          }}
        />
        <br />
        <br />
        <textarea
          style={textstyle}
          typeof="text"
          cols={40}
          rows={10}
          placeholder="input the answers"
          defaultValue={back}
          onChange={(e) => setBack(e.target.value)}
        />
        <br />
        <Button variant="outlined" type="submit">
          Save changes
        </Button>
      </form>
      <br></br>
      <hr></hr>
      <Link href={"/" + deckId}>Back to edit deck</Link>
    </div>
  );
}
