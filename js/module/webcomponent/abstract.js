import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Abstract extends Cartridge {
    static styles = [
        Cartridge.styles,
        css`
            .abstract {
                font-size: 0.9em;
                background-color: var(--x-abstract-bg-color, white);
                border-color: var(--x-abstract-border-color, black);
                max-width: 70%;
                margin: 15vh auto;
            }

            .abstract::before {
                content: "Abstract";
                color: var(--x-abstract-annotation-color, black);
            }
        `,
    ];

    render() {
        return html`
            <div class="${Cartridge.css.class} abstract">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define("x-abstract", Abstract);
