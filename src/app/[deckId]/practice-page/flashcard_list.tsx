import Flashcard from "./flashcard";

export default function flashcard_list({ data, deckId }: any) {
  return (
    <div>
      {data.map((flashcard: any) => {
        return (
          <Flashcard flashcard={flashcard} deckId={deckId} key={flashcard.id} />
        );
      })}
    </div>
  );
}
