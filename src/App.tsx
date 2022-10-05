import { useState, useEffect } from "react";
// import autoAnimate from '@formkit/auto-animate';
import { useAutoAnimate } from "@formkit/auto-animate/react";

import "./App.css";

const generateRandomHexColor = () =>
  `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padEnd(6, "0")}`;

interface Game {
  started: boolean;
  correct: boolean;
  result: boolean | undefined;
  disabled: boolean;
  guesses: number;
  score: number;
  color: string;
  average: number;
}

function App() {
  const COLOR_GUESSES = 10;
  const [game, setGame] = useState<Game>({
    started: true,
    correct: false,
    result: undefined,
    disabled: false,
    guesses: 0,
    score: 0,
    color: "",
    average: 0,
  });

  const [answers, setAnswers] = useState<string[]>([]);
  const [parent] = useAutoAnimate<HTMLDivElement>();

  const generateColors = () => {
    if (game.score < COLOR_GUESSES - 1) {
      const actualColor = generateRandomHexColor();
      setGame((game) => ({
        ...game,
        color: actualColor,
        result: undefined,
        disabled: false,
      }));
      setAnswers(
        [
          actualColor,
          generateRandomHexColor(),
          generateRandomHexColor(),
          generateRandomHexColor(),
        ].sort(() => 0.5 - Math.random())
      );
    } else {
      setGame((game) => ({ ...game, started: false, disabled: true }));
    }
  };

  useEffect(() => {
    generateColors();
  }, []);

  useEffect(() => {
    setGame((game) => ({
      ...game,
      average:
        game.guesses === 0 ? 0 : Math.round((game.score / game.guesses) * 100),
    }));
  }, [game.guesses, game.color]);

  function handleAnswersClicked(answer: string) {
    if (answer === game.color) {
      setGame((game) => ({
        ...game,
        correct: true,
        result: true,
        guesses: game.guesses + 1,
        score: game.score + 1,
        disabled: true,
      }));
      setTimeout(() => {
        generateColors();
      }, 1500);
    } else {
      setGame((game) => ({
        ...game,
        correct: false,
        result: false,
        guesses: game.guesses + 1,
      }));
    }
  }

  function restartGame() {
    generateColors();
    setGame({
      ...game,
      started: true,
      correct: false,
      result: undefined,
      disabled: false,
      guesses: 0,
      score: 0,
      average: 0,
    });
  }

  return (
    <div className="hex-color-game">
      <span className="rnbw">
        🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣
      </span>
      <h1>
        <span>C</span>
        <span>o</span>
        <span>l</span>
        <span>o</span>
        <span>r</span> guess
      </h1>
      <p>
        You'll be given 10 colors to guess, your goal is to get the highest
        percentage possible.
      </p>
      <p>
        <strong>OMG SO MUCH FUN!</strong>
      </p>
      <p>
        Score: {game.score} / Guesses: {game.guesses} / Average correct:{" "}
        {game.average}%
      </p>
      <div className="guess-me" style={{ background: game.color }}>
        {game.result != undefined && (
          <div className="results">
            {game.result == false && game.started == true && (
              <div className="error">
                <p>
                  ❌<br />
                  Wrong!
                </p>
              </div>
            )}
            {game.result == true && game.started == true && (
              <div className="correct">
                <p>
                  ✅<br />
                  Correct!
                </p>
              </div>
            )}
            {game.started == false && (
              <div className="gameover">
                <>
                  <p>
                    Game over!
                    <br />
                    You scored {game.average}%!
                  </p>
                  {game.average >= 80 && <p>Amazing, you get 🍰!</p>}
                  <button onClick={() => restartGame()}>Play again?</button>
                </>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="choices" ref={parent}>
        {answers.map((answer) => (
          <button
            onClick={() => handleAnswersClicked(answer)}
            key={answer}
            disabled={game.disabled}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
