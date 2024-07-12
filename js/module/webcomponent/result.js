import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Result extends Cartridge {
    static styles = [
        Cartridge.styles,
        css`
            .result {
                color: var(--x-result-color, black);
                margin: var(--x-result-margin, 2rem) auto;
                background-color: var(--x-result-bg-color, white);
                border-color: var(--x-result-border-color, black);
            }

            .result::before {
                content: "Result";
                color: var(--x-result-annotation-color, black);
            }
        `,
    ];

    constructor() {
        super();
    }

    render() {
        return html`
            <div class="${Cartridge.css.class} result">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define("x-result", Result);
