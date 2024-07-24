/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Result extends Cartridge {
    static styles = [
        Cartridge.styles,
        css`
            .result {
                color: var(--x-result-color, black);
                margin: var(--x-cartridge-margin, 2rem auto);
                background-color: var(--x-result-bg-color, white);
                border-color: var(--x-result-border-color, black);
            }

            .result::before {
                content: "Result";
                color: var(--x-result-annotation-color, black);
            }
        `,
    ];

    render() {
        return html`
            <div class="${Cartridge.css.class} result">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define("x-result", Result);
