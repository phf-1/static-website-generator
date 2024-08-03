/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Cartridge } from "./cartridge";
import { Utils } from "../../utils";

class Definition extends Cartridge {
    static properties = {
        term: {},
    };

    static styles = [
        Cartridge.styles,
        css`
            .definition {
                color: var(--x-definition-color, black);
                margin: var(--x-cartridge-margin, 2rem auto);
                background-color: var(--x-definition-bg-color, white);
                border-color: var(--x-definition-border-color, black);
            }

            .definition::before {
                content: "Definition";
                color: var(--x-definition-annotation-color, black);
            }

            #term {
                margin-bottom: var(--x-definition-term-margin-bottom, 1rem);
            }
        `,
    ];

    // Public

    render() {
        this.id || Utils.raise("An id must be defined.");
        return html`
            <div class="${Cartridge.css.class} definition">
                <p id="term"><strong>${this.term}</strong></p>
                <slot></slot>
            </div>
        `;
    }
}

customElements.define("x-definition", Definition);
