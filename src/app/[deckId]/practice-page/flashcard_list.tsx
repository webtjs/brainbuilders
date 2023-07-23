import Flashcard from "./flashcard";

export default function flashcard_list({ data }: any) {
  return (
    <div>
      {data.map((flashcard: any) => {
        return (
          <Flashcard
            flashcard={flashcard}
            deckId={flashcard.id}
            key={flashcard.id}
          />
        );
      })}
    </div>
  );
}
