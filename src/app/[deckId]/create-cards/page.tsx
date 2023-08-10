"use client";

import Link from "next/link";
//Import from MaterialUI for aesthetic purposes
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
// MUI imports for media upload
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

//Access data from other places
import "./style2.css";
import { auth, db, storage } from "@/config/firebase";
import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { redirect } from "next/navigation";

export default function CreateCards({ params }: any) {
  //New flashcards
  const [front, setFront] = useState("");
  const [frontMedia, setFrontMedia] = useState<File | null>(null);
  const [back, setBack] = useState("");
  const [backMedia, setBackMedia] = useState<File | null>(null);
  const [type, setType] = useState("flip");
  const [level, setLevel] = useState(1);
  const [review, setReview] = useState(1);
  // User states
  const [userId, setUserId] = useState("");
  const [haveUser, setHaveUser] = useState(true);
  const [lev, setLev] = useState("Hard");
  const [inputError, setInputError] = useState("");
  const deckId = params.deckId;


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
        console.log(result.metadata);
        getDownloadURL(result.ref).then(async (url) => {
          console.log(side);
          await setDoc(
            flashcardRef,
            { [side]: url, media: true },
            { merge: true }
          ).catch((err) => {
            console.error(err);
          });
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /**
   * Upload the front and back side of the flashcard, and the card type and media into Firebase
   * 
   * @param[in] input Front and back input, card type, card level, and the file uploaded
   */
  const sumbitCards = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const answerDisplay = collection(db, userId, deckId, "flashcards");
    if (
      (front == "" && frontMedia == null) ||
      (back == "" && backMedia == null)
    ) {
      setInputError("Please ensure both sides have at least a text or media.");
      return;
    }
    try {
      await addDoc(answerDisplay, {
        front: front,
        back: back,
        type: type,
        level: level,
        review: review,
      }).then((doc) => {
        mediaUpload(frontMedia, doc.id, "frontMedia");
        mediaUpload(backMedia, doc.id, "backMedia");
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
   * Change the level of difficulty the flashcard is set to
   * 
   * @param[in] input The current level of the flashcards
   */
  const setDifficulty = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("works")
    if (level == 1) {
      setLevel(2);
    } 
  };
  setDifficulty();

  /**
   * Set user id on the banner to the user id inside Firebase
   * 
   * @param[in] input The user id stored inside Firebase
   */
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
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
      <h2>This is where you create your own flashcards</h2>

      <form className="form_to_sub" onSubmit={sumbitCards}>
        <h3>Difficulty level</h3>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="Easy"
            name="radio-buttons-group"
            onChange={(e) => setLev(e.target.value)}
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
          onChange={(e) => setBack(e.target.value)}
        />
        <br />
        <Button variant="outlined" type="submit">
          Add
        </Button>
      </form>
      {inputError && <div className="error">{inputError}</div>}
      <br></br>
      <hr></hr>
      <Link href={"/" + deckId}>Back to Edit flashcard</Link>
    </div>
  );
}
