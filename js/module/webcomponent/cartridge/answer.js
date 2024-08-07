/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Answer extends Cartridge {
    static properties = {
        _hidden: {},
    };
    static styles = [
        Cartridge.styles,
        css`
            .answer {
                color: var(--x-answer-color, black);
                margin: var(--x-cartridge-margin, 2rem auto);
                background-color: var(--x-answer-bg-color, white);
                border-color: var(--x-answer-border-color, black);
            }

            .answer.hidden {
                display: none;
            }

            .answer::before {
                content: "Answer";
                color: var(--x-answer-annotation-color, black);
            }
        `,
    ];

    constructor() {
        super();
        this._hidden = true;
    }

    render() {
        const hidden = this._hidden ? "hidden" : "";
        return html`
            <div class="${Cartridge.css.class} answer ${hidden}">
                <slot></slot>
            </div>
        `;
    }

    show() {
        this._hidden = false;
    }

    hide() {
        this._hidden = true;
    }
}

customElements.define("x-a", Answer);
