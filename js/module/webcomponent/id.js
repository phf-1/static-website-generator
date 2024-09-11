/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css, LitElement } from "lit";
import { sharedStyles } from "./style";

export class Id extends LitElement {
    static styles = [
        sharedStyles,
        css`
div {
  position: relative;
  display: inline-block;
}

div span {
    font-family: 'Mono';
    font-size: 0.8em;
    padding: 0 0.2em;
    background: var(--c-blue-50);
    border-radius: 2px;
}

.button {
    display: none;
    font-size: 0.5rem;
}
div:hover button {
    display: inline-block;
}
        `,
    ];

    render() {
				return html`<div>
<span><slot></slot> (Id)</span>
<button class="button" @click="${this.#copy_to_clipboard}">Copy!</button>
</div>`;
    }

		#copy_to_clipboard() {
				navigator.clipboard.writeText(this.id).then(() => {
            console.log(`Id copied to clipboard. id = ${this.id}`);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
		}
}

customElements.define("x-id", Id);
