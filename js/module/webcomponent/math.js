/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html } from "lit";
import { Blockmath } from "./blockmath";

class Math extends Blockmath {
    render() {
        const content =
            this._mathml === "" ? html`<slot></slot>` : html`${this._mathml}`;
        return html`<span>${content}</span>`;
    }
}

customElements.define("x-math", Math);
