/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css, LitElement } from "lit";
import { sharedStyles } from "./style";

class QuestionAnswer extends LitElement {
    static properties = {
        _hidden: {},
    };

    static styles = [
        sharedStyles,
        css`
            .question-answer {
                margin: var(--x-qa-margin, 4rem 0);
            }
            .question-answer .actions {
                display: flex;
                justify-content: right;
                gap: 1rem;
            }
            .question-answer .content {
                display: flex;
                flex-direction: column;
            }
        `,
    ];

    constructor() {
        super();
        this._hidden = true;
    }

    render() {
        const show_btn = html`<button class="button" @click="${this._show}">
            SHOW
        </button>`;
        const hide_btn = html`<button class="button" @click="${this._hide}">
            HIDE
        </button>`;
        const action = this._hidden ? show_btn : hide_btn;
        return html`
            <div class="question-answer">
                <div class="content">
                    <slot></slot>
                </div>
                <div class="actions">${action}</div>
            </div>
        `;
    }

    firstUpdated() {
        this._hidden ? this._hide() : this._show();
    }

    _answers() {
        return this.shadowRoot
            .querySelector("slot")
            .assignedElements()
            .filter((el) => el.tagName === "X-A");
    }

    _show() {
        this._answers().forEach((answer) => answer.show());
        this._hidden = false;
    }

    _hide() {
        this._answers().forEach((answer) => answer.hide());
        this._hidden = true;
    }
}

customElements.define("x-qa", QuestionAnswer);
