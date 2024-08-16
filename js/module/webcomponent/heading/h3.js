/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Heading } from "./heading";

class H3 extends Heading {
    static styles = [
        Heading.styles,
        css`
            section {
                padding-left: var(--x-h3-padding-left, 1rem);
            }

            a:hover {
                text-decoration: none;
            }

            i {
                position: absolute;
                font-style: normal;
                font-size: 0.8em;
                left: -1.3em;
                visibility: hidden;
            }

            a:hover i {
                visibility: visible;
            }

            h3 {
                position: relative;
                display: table;
                font-size: var(--x-h3-font-size, 1.2rem);
                margin-top: 0;
                line-height: var(--x-h3-line-height, 1.2);
                padding-bottom: var(--x-h3-padding-bottom, 0.1rem);
                border-bottom: 1px solid currentColor;
                margin-bottom: var(--x-h3-margin-bottom, 1.2rem);
                padding-top: var(--x-h3-padding-top, 1rem);
                font-weight: var(--x-h3-font-weight, 400);
                font-family: var(--x-h3-font-family, sans-serif);
                color: var(--x-h3-color, black);
            }
        `,
    ];

    render() {
        return html`
            <section>
                <a href="#${this.id}"
                    ><h3><i>🔗</i>${this.keyword()}${this.name}</h3></a
                >
                <slot></slot>
            </section>
        `;
    }
}

customElements.define("x-h3", H3);
