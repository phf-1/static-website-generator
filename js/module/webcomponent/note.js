/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

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
