const startMenu = document.getElementById("startMenu");
const gameContainer = document.getElementById("gameContainer");
const startGameBtn = document.getElementById("startGameBtn");

const inputForm = document.getElementById("inputForm");
const inputFields = Array.from(document.getElementsByClassName('guess'));
const inputContainers = Array.from(document.getElementsByClassName("inputContainer"));

// game state
let correctDigits = [0, 0, 0, 0];
const correctDigitsTally = new Map();
let score = 0;

// add digit field events
inputFields.forEach(
    (el, index) => {
        el.addEventListener("keydown", (event) => {
            // escape hatch for browser/system shortcuts (eg. ctrl+r)
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            event.preventDefault(); // stop anything from falling through

            const isNumber = /^[0-9]$/.test(event.key);

            if (isNumber) {
                el.value = event.key;
                if (index < inputFields.length - 1) inputFields[index + 1].focus();
            }

            if (event.key === "Backspace") {
                el.value = "0";
                if (index > 0) inputFields[index - 1].focus();
            }

            if (event.key === "ArrowLeft" && index > 0) inputFields[index - 1].focus();
            if (event.key === "ArrowRight" && index < inputFields.length - 1) inputFields[index + 1].focus();
        });
    });

// always trigger "submit" on enter key
inputForm.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        inputForm.dispatchEvent(new SubmitEvent("submit", { bubbles: true, cancelable: true }));
    }
});

inputForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // for loop so we can break out when needed
    for (let i = 0; i < inputContainers.length; i++) {
        if (!inputContainers[i].disabled) {
            const guessElements = Array.from(inputContainers[i].querySelectorAll("input"));
            const guess = guessElements.map((input) => parseInt(input.value));

            const correctGuesses = guess.map((digit, index) => {
                const returnObj = { digitGuess: digit, index: index, solution: correctDigits[index] };
                if (digit === correctDigits[index]) {
                    correctDigitsTally.set(digit, correctDigitsTally.get(digit) - 1);
                    return { ...returnObj, correctness: "correct" };
                }
                return false;
            });

            const misplacedGuesses = guess.map((digit, index) => {
                const returnObj = { digitGuess: digit, index: index, solution: correctDigits[index] };
                if (correctDigitsTally.get(digit) > 0) {
                    return { ...returnObj, correctness: "almost" }
                }
                return false;
            });

            const guessesMerged = correctGuesses.map((guessObject, index) => {
                if (guessObject) {
                    return guessObject;
                }
                if (misplacedGuesses[index] !== false) {
                    return misplacedGuesses[index];
                }
                return { digitGuess: guess[index], index: index, solution: correctDigits[index], correctness: "wrong" };
            });


            guessesMerged.forEach((guess, index) => {
                const inputElem = guessElements[index];
                inputElem.classList.add(guess.correctness);

                if (guess.digitGuess > guess.solution) {
                    inputElem.parentElement.classList.add("lower")
                }

                if (guess.digitGuess < guess.solution) {
                    inputElem.parentElement.classList.add("higher")
                }

            });


            // check the full guess
            if (guess.toString() === correctDigits.toString()) {
                score++;

                inputContainers[i].disabled = true;
                const fieldsetButton = inputContainers[i].querySelector("button");
                fieldsetButton.disabled = true;
                const scoreElem = document.getElementById("score");
                scoreElem.innerText = `Score: ${score}`;

                resetGameBoard();
                break;
            }

            // if last fieldset had wrong guess end the game
            if (guess.toString() !== correctDigits.toString()) {
                // if last fieldset is not disabled, this is our last guess
                if (!inputContainers[inputContainers.length - 1].disabled) {
                    const gameOverDiv = document.createElement("div");
                    gameOverDiv.id = "gameOverDiv";

                    const gameOverText = document.createElement("div");
                    gameOverText.innerText = `Game over! Your score is ${score}`;
                    gameOverText.id = "gameOverText";
                    gameOverDiv.appendChild(gameOverText);

                    const tryAgainBtn = document.createElement("button");
                    tryAgainBtn.innerText = "Try again?";
                    tryAgainBtn.id = "tryAgainBtn";
                    tryAgainBtn.addEventListener("click", resetGameBoard);
                    gameOverDiv.appendChild(tryAgainBtn);

                    document.querySelector(".container").append(gameOverDiv);
                };
            }

            // move to next set of guesses
            inputContainers[i].disabled = true;
            const fieldsetButton = inputContainers[i].querySelector("button");
            fieldsetButton.disabled = true;
            const nextFieldset = inputContainers[i + 1];
            if (nextFieldset) {
                nextFieldset.disabled = false;
                const nextFieldsetButton = nextFieldset.querySelector("button");
                nextFieldsetButton.disabled = false;
                const nextInputs = Array.from(nextFieldset.querySelectorAll("input"));
                if (nextInputs) nextInputs[0].focus();
            };

            break;
        }
    }
});

function resetGameBoard() {
    if (document.getElementById("gameOverDiv")) {
        const gameOverDiv = document.getElementById("gameOverDiv");
        gameOverDiv.parentNode.removeChild(gameOverDiv);
    }

    inputFields.forEach((inp) => {
        inp.value = 0;
        inp.style = "";
        inp.classList.remove("correct", "almost", "wrong");
        inp.parentElement.classList.remove("lower", "higher");
    });
    inputContainers.forEach((fs) => {
        fs.disabled = true;
        const btn = fs.querySelector("button");
        btn.disabled = true;
    });
    inputContainers[0].disabled = false;
    inputContainers[0].querySelector("button").disabled = false;
    inputContainers[0].querySelector("input").focus();

    correctDigits = generateDigits();
}

function generateDigits() {
    let digits = [];

    for (let i = 0; i < 4; i++) {
        const digit = Math.floor(Math.random() * 10);
        digits.push(digit);
    }

    console.log("The next digits are:", digits);

    tallyDigits(digits);

    return digits;
}

function tallyDigits(digitsArray) {
    correctDigitsTally.clear();
    for (const digit of digitsArray) {
        correctDigitsTally.set(digit, (correctDigitsTally.get(digit) || 0) + 1);
    }
    console.log("Digits tally:", Object.fromEntries(correctDigitsTally));
}

function startNewGame() {
    correctDigits = generateDigits();
    inputFields[0].focus();
}

window.addEventListener("DOMContentLoaded", () => {
    startGameBtn.addEventListener("click", () => {
        startMenu.style.display = "none";
        gameContainer.style.display = "block";
        startNewGame();
    });
})
