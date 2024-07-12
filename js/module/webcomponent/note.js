import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Note extends Cartridge {
    static styles = [
        Cartridge.styles,
        css`
            .note {
                color: var(--x-note-color, black);
                margin: var(--x-note-margin, 2rem) auto;
                background-color: var(--x-note-bg-color, white);
                border-color: var(--x-note-border-color, black);
            }

            .note::before {
                content: "Note";
                color: var(--x-note-annotation-color, black);
            }
        `,
    ];

    render() {
        return html`
            <div class="${Cartridge.css.class} note">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define("x-note", Note);
