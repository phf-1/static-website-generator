/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { sharedStyles } from "./style";
import { Heading } from "./heading";

class H6 extends Heading {
    static styles = [
        sharedStyles,
        css`
            section {
                padding-left: var(--x-h6-padding-left, 1rem);
            }

            h6 {
                display: table;
                font-size: var(--x-h6-font-size, 1.2rem);
                margin-top: 0;
                padding-top: var(--x-h6-padding-top, 1rem);
                line-height: var(--x-h6-line-height, 1.2);
                padding-bottom: var(--x-h6-padding-bottom, 0.1rem);
                border-bottom: 1px solid currentColor;
                margin-bottom: var(--x-h6-margin-bottom, 1.2rem);

                font-weight: var(--x-h6-font-weight, 400);
                font-family: var(--x-h6-font-family, sans-serif);
                color: var(--x-h6-color, black);
            }
        `,
    ];

    render() {
        return html`
            <section>
                <h6>${this.keyword()}${this.name}</h6>
                <slot></slot>
            </section>
        `;
    }
}

customElements.define("x-h6", H6);
