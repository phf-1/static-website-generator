/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Keyword } from "./keyword";

class Doing extends Keyword {
    static styles = [
        Keyword.styles,
        css`
            .doing {
                background-color: var(--x-doing-bg-color, orange);
            }

            .doing::before {
                content: "doing";
            }
        `,
    ];

    render() {
        return html`<span class="${Keyword.css.class} doing"></span>`;
    }
}

customElements.define("x-doing", Doing);
