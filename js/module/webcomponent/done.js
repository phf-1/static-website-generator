/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Keyword } from "./keyword";

class Done extends Keyword {
    static styles = [
        Keyword.styles,
        css`
            .done {
                background-color: var(--x-done-bg-color, green);
            }

            .done::before {
                content: "done";
            }
        `,
    ];

    render() {
        return html`<span class="${Keyword.css.class} done"></span>`;
    }
}

customElements.define("x-done", Done);
