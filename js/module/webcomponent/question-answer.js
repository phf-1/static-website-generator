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
            .question-answer .actions {
                display: flex;
                justify-content: right;
                gap: 1rem;
                margin-top: var(--qa-margin-top, 4rem);
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

    // Public

    render() {
        const show_btn = html`<button class="button" @click="${this._show}">
            SHOW ANSWER
        </button>`;
        const hide_btn = html`<button class="button" @click="${this._hide}">
            HIDE ANSWER
        </button>`;
        const action = this._hidden ? show_btn : hide_btn;
        return html`
            <div class="question-answer">
                <div class="actions">${action}</div>
                <div class="content">
                    <slot></slot>
                </div>
            </div>
        `;
    }

    is_hidden() {
        return this._hidden;
    }

    is_visible() {
        return !this._hidden;
    }

    show() {
        this._show();
    }

    hide() {
        this._hide();
    }

    // Calllbacks

    firstUpdated() {
        this._hidden ? this._hide() : this._show();
    }

    // Private

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
