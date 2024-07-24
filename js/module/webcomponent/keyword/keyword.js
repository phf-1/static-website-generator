/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css, LitElement } from "lit";
import { sharedStyles } from "../style";

export class Keyword extends LitElement {
    static css = { class: "keyword" };

    static styles = [
        sharedStyles,
        css`
            .keyword {
                font-family: "Mono";
                padding: var(--x-keyword-padding, 0 0.2em);
                margin: var(--x-keyword-margin, 0 0.5em 0 0);
                color: var(--x-keyword-color, white);
                border-radius: var(--x-keyword-border-radius, 2px);
                font-weight: bold;
                text-transform: uppercase;
                font-size: var(--x-keyword-font-size, 0.75em);
                background-color: var(--x-keyword-bg-color, black);
            }

            .keyword::before {
                content: "todo";
            }
        `,
    ];

    render() {
        return html`<span class="${Keyword.css.class}"></span>`;
    }
}
