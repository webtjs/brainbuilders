import "./card.css";
import "./transition.css";

/**
 * Displays the front and back of a flashcard with text only
 *
 * @param currentFlashcard An object of the active flashcard
 */
export default function Card({ currentFlashcard }: any) {
  return (
    <div className="card">
      <div className="card-back">{currentFlashcard.back}</div>
      <div className="card-front">{currentFlashcard.front}</div>
    </div>
  );
}
