const inputForm = document.getElementById("inputForm");
const inputFields = Array.from(document.getElementsByClassName('guess'));
const inputContainers = Array.from(document.getElementsByClassName("inputContainer"));

// game state
const correctDigits = [6, 5, 4, 9];
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

            // reset
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
                        console.log(`Digit ${guessedDigit} is correctly placed!`);
                        inputElement.classList.add("correct");
                    } else if (correctDigits.includes(guessedDigit)) {
                        console.log(`Digit ${guessedDigit} is somewhere here!`);
                        inputElement.classList.add("almost");
                    } else {
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

                // reset the board
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

                break;
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