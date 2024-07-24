/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Context extends Cartridge {
    static styles = [
        Cartridge.styles,
        css`
            .context {
                color: var(--x-context-color, black);
                margin: var(--x-cartridge-margin, 2rem auto);
                background-color: var(--x-context-bg-color, white);
                border-color: var(--x-context-border-color, black);
            }

            .context::before {
                content: "Context";
                color: var(--x-context-annotation-color, black);
            }
        `,
    ];

    render() {
        return html`
            <div class="${Cartridge.css.class} context">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define("x-context", Context);
