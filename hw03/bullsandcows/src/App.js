import { useState } from 'react';
import * as util from './gameUtil.js';
import './App.css';

// Guess is the input box and button for guessing the digits
// as well as the warning for invalid guesses
// the textbox and button are disabled if the game is over
// Both pressing "Enter" and the button will validate/attempt a guess
function Guess({guess, setGuess, state, tryGuess, validate}) {
	
	function enter(evt) {
		if (evt.key == "Enter") {
			validate(evt.target.value);
		}
	}

	function type(evt) {
		setGuess(evt.target.value);
	}

	if (util.gameOver(state.recorded, state.secret)) {
		return (
			<div>
				<p id="Guess">
					<input disabled type="text" value={guess} onChange={type} onKeyPress={enter} />
					<button disabled onClick={validate}>Guess</button>
				</p>
				<p id="Warn">{state.warning}</p>
			</div>
		);
	}
	else {
		return <div>
				<p id="Guess">
					<input type="text" value={guess} onChange={type} onKeyPress={enter} />
					<button onClick={validate}>Guess</button>
				</p>
				<p id="Warn">{state.warning}</p>
			</div>;
	}
}
	
// A Record is a pairing of a guessed set of 4 unique digits
// and the report of how many digits were correctly guess (A)
// and how many are present in the secret but in a different position (B)
function Record({secret, guess}) {
	if (guess == undefined) {
		return (
			<tr>
				<td></td>
				<td></td>
			</tr>
		);
	}

	// count the perfect digit guess and misplaced digits
	// guess is a string and secret is an array of numbers
	// so some conversion is done for the comparisons
	var perfect = 0;
	var misplaced = 0;
	var guessArr = guess.split("").map((x) => Number(x));
	for (var i = 0; i < 4; i++) {
		if (secret[i] == guessArr[i]) {
			perfect += 1;
		}
		else if (secret.includes(guessArr[i])) {
			misplaced += 1;
		}
	}
	return (
		<tr>
			<td>{guess}</td>
			<td>{perfect}A{misplaced}B</td>
		</tr>
	);
}

// Status bar that states the number of guesses remaining while the game is ongoing
// as well as the result if the game is over
function Status({state}) {
		if (util.gameWon(state.recorded, state.secret)) { 
			return <p id="Win">You Win!</p>
		}
		else if (util.gameLost(state.recorded, state.secret)) { 
			return <p id="Lose">You Lose!</p>
		}
		else {
			var msg = "Guesses left: " + (8 - state.recorded.length)
			return <p>{msg}</p>;
		}
	}

function App() {	
	// game state is the secret digits, a warning message for invalid inputs
	// and the recorded guess
	const [state, setState] = useState({
		secret: util.genRand4(),
		warning: "",
		recorded: []
	});
	const [guess, setGuess] = useState("");

	// resets the game state and current guess 
	// obtains a new secret set of digits to guess
	function reset() {
		setState({
			secret: util.genRand4(),
			warning: "",
			recorded: []
		});
		setGuess("");
	}

	// logic for submitting a guesss assuming it was validated
	// records the guess and resets the current guess
	function tryGuess() {
		if (!util.gameOver(state.recorded, state.secret)) {
			let prev = state.recorded;
			prev.push(guess);
			setState({secret: state.secret, warning: "", recorded: prev});
			setGuess("");
		}
	}
	
	// based on current guess, sets a warning for invalid inputs
	// or attempts to guess with a valid input
	function validate() {
		var warnMsg = "";
		if (guess.length != 4) {
			warnMsg = "Valid guesses must be exactly 4 digits";
		}
		else if (!util.uniqueDigits(guess)) {
			warnMsg = "Valid guesses cannot have duplicate digits or non-digit characters.";
		}
		else if (state.recorded.includes(guess)) {
			warnMsg = "Cannot reuse recorded guess";
		}
		else {
			tryGuess();
		}
		setState({secret: state.secret, warning: warnMsg, recorded: state.recorded});
	}

	return (
		<div className="Game">
			<header>
				<h1>TKWaffle Bulls and Cows</h1>
			</header>

			<div className="Menu">
				<button onClick={reset}>New Game</button>
			</div>
				
			<div className="StatusBar">
				<Status state={state} />
			</div>

			<Guess guess={guess} setGuess={setGuess}
					state={state} tryGuess={tryGuess} validate={validate} />
			
			<table id="Recorded">
				<tr>
					<th>Guess</th>
					<th>Result</th>
				</tr>
				<Record secret={state.secret} guess={state.recorded[0]} />
				<Record secret={state.secret} guess={state.recorded[1]} />
				<Record secret={state.secret} guess={state.recorded[2]} />
				<Record secret={state.secret} guess={state.recorded[3]} />
				<Record secret={state.secret} guess={state.recorded[4]} />
				<Record secret={state.secret} guess={state.recorded[5]} />
				<Record secret={state.secret} guess={state.recorded[6]} />
				<Record secret={state.secret} guess={state.recorded[7]} />
			</table>

		</div>
	);
}

export default App;
