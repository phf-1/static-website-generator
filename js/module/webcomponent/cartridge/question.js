/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Question extends Cartridge {
    static styles = [
        Cartridge.styles,
        css`
            .question {
                color: var(--x-question-color, black);
                margin: var(--x-cartridge-margin, 2rem auto);
                background-color: var(--x-question-bg-color, white);
                border-color: var(--x-question-border-color, black);
            }

            .question::before {
                content: "Question";
                color: var(--x-question-annotation-color, black);
            }
        `,
    ];

    render() {
        return html`
            <div class="${Cartridge.css.class} question">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define("x-q", Question);
