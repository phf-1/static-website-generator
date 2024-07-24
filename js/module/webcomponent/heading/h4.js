/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Heading } from "./heading";

class H4 extends Heading {
    static styles = [
        Heading.styles,
        css`
            section {
                padding-left: var(--x-h4-padding-left, 1rem);
            }

            h4 {
                display: table;
                font-size: var(--x-h4-font-size, 1.2rem);
                margin-top: 0;
                padding-top: var(--x-h4-padding-top, 1rem);
                line-height: var(--x-h4-line-height, 1.2);
                padding-bottom: var(--x-h4-padding-bottom, 0.1rem);
                border-bottom: 1px solid currentColor;
                margin-bottom: var(--x-h4-margin-bottom, 1.2rem);

                font-weight: var(--x-h4-font-weight, 400);
                font-family: var(--x-h4-font-family, sans-serif);
                color: var(--x-h4-color, black);
            }
        `,
    ];

    render() {
        return html`
            <section>
                <h4>${this.keyword()}${this.name}</h4>
                <slot></slot>
            </section>
        `;
    }
}

customElements.define("x-h4", H4);
