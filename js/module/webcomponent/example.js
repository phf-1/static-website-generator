import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Example extends Cartridge {
    static styles = [
        Cartridge.styles,
        css`
            .example {
                color: var(--x-example-color, black);
                margin: var(--x-example-margin, 2rem) auto;
                background-color: var(--x-example-bg-color, white);
                border-color: var(--x-example-border-color, black);
            }

            .example::before {
                content: "Example";
                color: var(--x-example-annotation-color, black);
            }
        `,
    ];

    constructor() {
        super();
    }

    render() {
        return html`
            <div class="${Cartridge.css.class} example">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define("x-example", Example);
