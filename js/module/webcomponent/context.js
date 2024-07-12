import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Context extends Cartridge {
    static styles = [
        Cartridge.styles,
        css`
            .context {
                color: var(--x-context-color, black);
                margin: var(--x-context-margin, 2rem) auto;
                background-color: var(--x-context-bg-color, white);
                border-color: var(--x-context-border-color, black);
            }

            .context::before {
                content: "Context";
                color: var(--x-context-annotation-color, black);
            }
        `,
    ];

    constructor() {
        super();
    }

    render() {
        return html`
            <div class="${Cartridge.css.class} context">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define("x-context", Context);
