/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Example extends Cartridge {
    static styles = [
        Cartridge.styles,
        css`
            .example {
                color: var(--x-example-color, black);
                margin: var(--x-example-margin, 2rem) auto;
                background-color: var(--x-example-bg-color, white);
                border-color: var(--x-example-border-color, black);
            }

            .example::before {
                content: "Example";
                color: var(--x-example-annotation-color, black);
            }
        `,
    ];

    render() {
        return html`
            <div class="${Cartridge.css.class} example">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define("x-example", Example);
