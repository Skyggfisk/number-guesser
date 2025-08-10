class GuessRow extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = this.createTemplate();
        this.fieldset = this.querySelector("fieldset");
        this.inputs = Array.from(this.querySelectorAll("input"));
    }

    createTemplate() {
        return `
            <fieldset class="inputContainer">
                ${[0, 1, 2, 3].map(i => `
                    <div class="inputWrapper">
                        <input class="guess" type="text" inputmode="numeric" maxlength="1" value="0" style="--index: ${i}" />
                    </div>
                    `).join("")}
                <button type="submit" style="position: absolute; left: -9999px; width: 1px; height: 1px;"></button>
            </fieldset>
        `
    }

    set disabled(value) {
        if (value) {
            this.fieldset.setAttribute("disabled", "");
            this.querySelector("button").setAttribute("disabled", "");
        } else {
            this.fieldset.removeAttribute("disabled");
            this.querySelector("button").removeAttribute("disabled");
        }
    }

    get disabled() {
        return this.fieldset.hasAttribute("disabled");
    }

    // TODO: The animation is really janky, needs a more holistic system,
    // for now hit some lucky magic numbers that work okay-ish.
    reset(noResetAnimation = false) {
        this.inputs.forEach((input, index) => {
            input.style.opacity = 0;
            input.parentElement.classList.remove("lower", "higher");

            // don't fade + scale 
            if (!noResetAnimation) {
                input.classList.add("reset-guess");
            }

            // staggered reset animation
            setTimeout(() => {
                input.value = 0;
                input.classList.remove("correct", "almost", "wrong", "reset-guess");
                input.parentElement.classList.remove("lower", "higher");
                input.style.opacity = 1;
            }, 500 + index * 100);
        });
    }
}

customElements.define("guess-row", GuessRow);
