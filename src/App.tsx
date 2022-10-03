import { useState, useEffect } from "react";
// import autoAnimate from '@formkit/auto-animate';
import { useAutoAnimate } from "@formkit/auto-animate/react";

import "./App.css";

const generateRandomHexColor = () =>
  `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padEnd(6, "0")}`;

enum Status {
  Started,
  GameOver,
}
enum Result {
  Correct,
  Wrong,
}

function App() {
  const COLOR_GUESSES = 3;
  const [color, setColor] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const [result, setResult] = useState<Result | undefined>(undefined);
  const [score, setScore] = useState<number>(0);
  const [guesses, setGuesses] = useState<number>(0);
  const [averageCorrect, setAverageCorrect] = useState<number>(0);
  const [parent] = useAutoAnimate<HTMLDivElement>();

  const generateColors = () => {
    if (status === Status.GameOver) return;
    const actualColor = generateRandomHexColor();
    setColor(actualColor);
    setAnswers(
      [
        actualColor,
        generateRandomHexColor(),
        generateRandomHexColor(),
        generateRandomHexColor(),
      ].sort(() => 0.5 - Math.random())
    );
    setResult(undefined);
  };

  useEffect(() => {
    setStatus(Status.Started);
    generateColors();
  }, []);

  useEffect(() => {
    setAverageCorrect(guesses === 0 ? 0 : Math.round((score / guesses) * 100));
  }, [guesses]);

  function handleAnswersClicked(answer: string) {
    const buttons = parent.current?.querySelectorAll("button");
    if (status === Status.GameOver) {
      buttons?.forEach((button) => {
        button.setAttribute("disabled", "true");
      });
      return;
    }
    if (answer === color) {
      setResult(Result.Correct);
      let currentScore = score + 1;
      setScore(currentScore);
      setTimeout(() => {
        generateColors();
      }, 1500);
    } else {
      setResult(Result.Wrong);
    }
    setGuesses(guesses + 1);
    if (score > COLOR_GUESSES - 1) {
      setStatus(Status.GameOver);
    }
    console.log(color, answers, status, score, guesses, averageCorrect);
  }

  return (
    <div className="App">
      <h1>Color guess</h1>
      <p>
        Score: {score} / Guesses: {guesses} / Average correct: {averageCorrect}%
      </p>
      <div className="guess-me" style={{ background: color }}>
        {result != undefined && (
          <div className="results">
            <div className="error">
              {result == Result.Wrong && status == Status.Started && (
                <p>
                  ❌<br />
                  Wrong!
                </p>
              )}
            </div>
            <div className="correct">
              {result == Result.Correct && status == Status.Started && (
                <p>
                  ✅<br />
                  Correct!
                </p>
              )}
            </div>
            <div className="gameover">
              {status == Status.GameOver && (
                <p>
                  Game over!
                  <br />
                  You scored a {averageCorrect}%!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="choices" ref={parent}>
        {answers.map((answer) => (
          <button onClick={() => handleAnswersClicked(answer)} key={answer}>
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
