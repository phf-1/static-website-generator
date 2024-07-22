/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Keyword } from "./keyword";

class Todo extends Keyword {
    static styles = [
        Keyword.styles,
        css`
            .todo {
                background-color: var(--x-todo-bg-color, red);
            }

            .todo::before {
                content: "todo";
            }
        `,
    ];

    render() {
        return html`<span class="${Keyword.css.class} todo"></span>`;
    }
}

customElements.define("x-todo", Todo);
