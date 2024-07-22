/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Keyword } from "./keyword";

class Failed extends Keyword {
    static styles = [
        Keyword.styles,
        css`
            .failed {
                background-color: var(--x-failed-bg-color, black);
            }

            .failed::before {
                content: "failed";
            }
        `,
    ];

    render() {
        return html`<span class="${Keyword.css.class} failed"></span>`;
    }
}

customElements.define("x-failed", Failed);
