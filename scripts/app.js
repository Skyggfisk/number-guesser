const correctDigits = [6, 5, 4, 9];
const inputForm = document.getElementById("inputForm");
const inputFields = Array.from(document.getElementsByClassName('guess'));
const inputContainers = Array.from(document.getElementsByClassName("inputContainer"));


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

    for (let i = 0; i < inputContainers.length; i++) {
        if (!inputContainers[i].disabled) {
            console.log(inputContainers[i], i);

            const guesses = Array.from(inputContainers[i].querySelectorAll("input"))
            guesses.forEach((inputElement, idx) => {
                const guessedDigit = parseInt(inputElement.value);

                // parseInt can still result in NaN
                if (Number.isInteger(guessedDigit)) {
                    console.log(`Checking digit ${guessedDigit} at input ${idx}`);
                    if (guessedDigit === correctDigits[idx]) {
                        console.log(`Digit ${guessedDigit} is correctly placed!`);
                        inputElement.style = "background-color: green";
                    } else if (correctDigits.includes(guessedDigit)) {
                        console.log(`Digit ${guessedDigit} is somewhere here!`);
                        inputElement.style = "background-color: yellow";
                    } else {
                        console.log(`Digit ${guessedDigit} NOT in number!`);
                        inputElement.style = "background-color: red";
                    }
                }
            });

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