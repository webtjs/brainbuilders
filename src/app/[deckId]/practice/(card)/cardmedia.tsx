import "./card.css";
import "./transition.css";

/**
 * Displays the front and back of a flashcard containing media
 *
 * @param currentFlashcard An object of the active flashcard
 */
export default function CardMedia({ currentFlashcard }: any) {
  return (
    <div className="card">
      {currentFlashcard.backMedia ? (
        <div className="card-back" style={{ display: "grid" }}>
          {currentFlashcard.back}
          <div className="img-box">
            <img src={currentFlashcard.backMedia} />
          </div>
        </div>
      ) : (
        <div className="card-back">{currentFlashcard.back}</div>
      )}
      {currentFlashcard.frontMedia ? (
        <div className="card-front" style={{ display: "grid" }}>
          {currentFlashcard.front}
          <div className="img-box">
            <img src={currentFlashcard.frontMedia} />
          </div>
        </div>
      ) : (
        <div className="card-front">{currentFlashcard.front}</div>
      )}
    </div>
  );
}
