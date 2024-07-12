import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Definition extends Cartridge {
    static styles = [
        Cartridge.styles,
        css`
            .definition {
                color: var(--x-definition-color, black);
                margin: var(--x-definition-margin, 2rem) auto;
                background-color: var(--x-definition-bg-color, white);
                border-color: var(--x-definition-border-color, black);
            }

            .definition::before {
                content: "Definition";
                color: var(--x-definition-annotation-color, black);
            }
        `,
    ];

    render() {
        return html`
            <div class="${Cartridge.css.class} definition">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define("x-definition", Definition);
