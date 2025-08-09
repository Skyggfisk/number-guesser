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

    reset() {
        this.inputs.forEach(input => {
            input.value = 0;
            input.classList.remove("correct", "almost", "wrong");
            input.parentElement.classList.remove("lower", "higher");
        })
    }
}

customElements.define("guess-row", GuessRow);
