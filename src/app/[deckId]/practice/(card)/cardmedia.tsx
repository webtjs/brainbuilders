import { useEffect, useState } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";
import "./card.css";
import "./transition.css";

export default function CardMedia({ currentFlashcard }: any) {
  const [mediaList, setMediaList] = useState<never[] | string[]>([]);
  const userId = "user-id";
  const deckId = "cs1231";
  const flashcardId = "flashcard-id";
  const pathName = userId + "/" + deckId + "/" + flashcardId + "/";
  const mediaListRef = ref(storage, pathName);

  useEffect(() => {
    listAll(mediaListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setMediaList((prev) => [...prev, url]);
          console.log(url);
        });
      });
    });
  }, []);

  return (
    <div className="card">
      <div className="card-back">{currentFlashcard.back}</div>
      <div className="card-front">
        {currentFlashcard.front}
        {mediaList.map((url) => {
          return <img src={url} key={url} />;
        })}
      </div>
    </div>
  );
}
