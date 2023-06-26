import "./card.css";
import "./transition.css";

export default function Card({ currentFlashcard }: any) {
  // submitted, setSubmitted
  // answer, setAnswer
  // {!submitted ? (answer box) : ({answer == currentFlashcard.back ? (disabled correct) : (disabled wrong)})}

  return (
    <div className="card">
      <div className="card-back">{currentFlashcard.back}</div>
      <div className="card-front">{currentFlashcard.front}</div>
    </div>
  );
}
