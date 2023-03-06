import { useState, useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import devtools from "devtools-detect";
import confetti from "canvas-confetti";

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
	const COLOR_GUESSES = 3;
	const initialGame: Game = {
		started: true,
		correct: false,
		result: undefined,
		disabled: false,
		guesses: 0,
		score: 0,
		color: "",
		average: 0,
	};

	const [game, setGame] = useState<Game>({ ...initialGame });

	const [answers, setAnswers] = useState<string[]>([]);
	const [color, setColor] = useState<string>("");
	const [parent] = useAutoAnimate<HTMLDivElement>();

	const generateColors = () => {
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
	};

	useEffect(() => {
		generateColors();
	}, []);

	useEffect(() => {
		setGame((game) => ({
			...game,
			average: game.guesses === 0 ? 0 : ~~((game.score / game.guesses) * 100),
		}));
	}, [game.guesses]);

	function handleAnswersClicked(answer: string) {
		if (answer === color) {
			setGame((game) => ({
				...game,
				correct: true,
				result: true,
				guesses: game.guesses + 1,
				score: game.score + 1,
				disabled: true,
			}));
			setTimeout(() => {
				if (COLOR_GUESSES - 1 === game.score) {
					setGame({ ...game, started: false, disabled: true });
					return;
				}
				setGame((game) => ({
					...game,
					disabled: false,
					result: undefined,
				}));
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
		setGame({ ...initialGame });
	}

	function omgConfetti() {
		confetti({
			particleCount: 150,
			startVelocity: 50,
			spread: 360,
			shapes: ["circle"],
			disableForReducedMotion: true,
			colors: ["#742061", "#c27c69", "#c27b6a", "#61561f", "#084b4e", "#0058af"],
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
				<span>r</span> #guess
			</h1>
			<p>
				You'll be given 10 colors to guess it's hex value, try to get the highest percentage
				possible.
			</p>
			<p>
				<strong>OMG SO MUCH FUN!</strong>
			</p>
			<p className="dashboard">
				Colors left: {COLOR_GUESSES - game.score} / Guesses: {game.guesses} / Score: {game.score}{" "}
				<strong className="avg">{game.average}%</strong>
			</p>
			<div className="guess-me" style={{ background: color }}>
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
						{game.result && game.started && (
							<div className="correct">
								<p>
									✅<br />
									Correct!
								</p>
							</div>
						)}
						{!game.started && (
							<div className="gameover">
								<>
									<p>
										Game over!
										<br />
										You scored {game.average}%
									</p>
									{game.average >= 65 && omgConfetti()}
									<div className="critique">
										{game.average >= 60 ? (
											<p>Amazing, you get 🍰!</p>
										) : game.average >= 50 ? (
											<p>Pretty good! You almost get 🍰</p>
										) : game.average >= 40 ? (
											<p>Not bad!</p>
										) : game.average >= 30 ? (
											<p>Could be better!</p>
										) : game.average >= 20 ? (
											<p>Not good!</p>
										) : game.average >= 10 ? (
											<p>Not good at all!</p>
										) : game.average >= 5 ? (
											<p>Are you even trying?</p>
										) : (
											<p>Like, what are you doing?</p>
										)}
									</div>

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
						onClick={(e) => {
							handleAnswersClicked(answer);
							const target = e.target as HTMLButtonElement;
							// disable current button
							target.disabled = true;
							target.className = "wrong-choice-bruv";
						}}
						key={answer}
						disabled={game.disabled}
					>
						{answer}
					</button>
				))}
			</div>
			{devtools.isOpen && <p>👀 You're not trying to cheat are you?</p>}
		</div>
	);
}

export default App;
