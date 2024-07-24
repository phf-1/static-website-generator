/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Method extends Cartridge {
    static styles = [
        Cartridge.styles,
        css`
            .method {
                color: var(--x-method-color, black);
                margin: var(--x-method-margin, 2rem) auto;
                background-color: var(--x-method-bg-color, white);
                border-color: var(--x-method-border-color, black);
            }

            .method::before {
                content: "Method";
                color: var(--x-method-annotation-color, black);
            }
        `,
    ];

    render() {
        return html`
            <div class="${Cartridge.css.class} method">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define("x-method", Method);
