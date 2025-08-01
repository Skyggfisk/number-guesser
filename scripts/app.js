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
            const isNumber = /^[0-9]$/.test(event.key);

            if (isNumber) {
                event.preventDefault();
                el.value = event.key;
                if (index < inputFields.length - 1) inputFields[index + 1].focus();
            }

            if (event.key === "Backspace") {
                event.preventDefault();
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
            console.log(inputContainers[i], i);

            let currentGuess = [];

            // color the fields according to digit match
            const guesses = Array.from(inputContainers[i].querySelectorAll("input"));
            guesses.forEach((inputElement, idx) => {
                const guessedDigit = parseInt(inputElement.value);

                // parseInt can still result in NaN
                if (Number.isInteger(guessedDigit)) {
                    console.log(`Checking digit ${guessedDigit} at input ${idx}`);
                    currentGuess.push(guessedDigit);

                    if (guessedDigit === correctDigits[idx]) {
                        // direct digit match - update the tally
                        correctDigitsTally.set(guessedDigit, correctDigitsTally.get(guessedDigit) - 1);
                        console.log(`Digit ${guessedDigit} is correctly placed!`);
                        inputElement.classList.add("correct");

                    } else if (correctDigits.includes(guessedDigit) && correctDigitsTally.get(guessedDigit) > 0) {
                        // the digit exists in the solution and not all positions have yet been found
                        console.log(`Digit ${guessedDigit} is somewhere here!`);
                        inputElement.classList.add("almost");
                    } else {
                        // the digit does not exist in the solution or all positions have already been found
                        console.log(`Digit ${guessedDigit} NOT in number!`);
                        inputElement.classList.add("wrong");
                    }
                }
            });

            // check the full guess
            console.log(currentGuess);
            if (currentGuess.toString() === correctDigits.toString()) {
                console.log("YOU DID IT GZ!");

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
            if (currentGuess.toString() !== correctDigits.toString()) {
                // if last fieldset is not disabled, this is our last guess
                if (!inputContainers[inputContainers.length - 1].disabled) {
                    console.log("LAST FIELDSET DISABLED CHECK");

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
    console.log("Resetting board...");

    if (document.getElementById("gameOverDiv")) {
        const gameOverDiv = document.getElementById("gameOverDiv");
        gameOverDiv.parentNode.removeChild(gameOverDiv);
    }

    inputFields.forEach((inp) => {
        inp.value = 0;
        inp.style = "";
        inp.classList.remove("correct", "almost", "wrong");
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
    // tally up the new digits for convenience
    correctDigitsTally.clear();
    for (const digit of digitsArray) {
        correctDigitsTally.set(digit, (correctDigitsTally.get(digit) || 0) + 1);
    }
    console.log("Digits tally:", Object.fromEntries(correctDigitsTally));
}

window.addEventListener("DOMContentLoaded", () => {
    correctDigits = generateDigits();
})
