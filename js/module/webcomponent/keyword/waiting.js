/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Keyword } from "./keyword";

class Waiting extends Keyword {
    static styles = [
        Keyword.styles,
        css`
            .waiting {
                background-color: var(--x-waiting-bg-color, orange);
            }

            .waiting::before {
                content: "waiting";
            }
        `,
    ];

    render() {
        return html`<span class="${Keyword.css.class} waiting"></span>`;
    }
}

customElements.define("x-waiting", Waiting);
