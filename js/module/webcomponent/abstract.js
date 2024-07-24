/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Abstract extends Cartridge {
    static styles = [
        Cartridge.styles,
        css`
            .abstract {
                font-size: var(--x-abstract-font-size, 0.9em);
                background-color: var(--x-abstract-bg-color, white);
                border-color: var(--x-abstract-border-color, black);
                max-width: var(--x-abstract-max-width, 70%);
                margin: var(--x-abstract-margin, 15vh auto);
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
