/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, LitElement } from "lit";
import { sharedStyles } from "../style";
import { Utils } from "../../utils";

class Heading extends LitElement {
	static properties = {
		name: {},
		state: {},
		id: { type: String, reflect: true },
	};

	constructor() {
		super();
		if (!this.id) {
			this.id = "";
		}
		if (!this.name) {
			this.name = "NAME";
		}
		if (!this.state) {
			this.state = null;
		}
	}

	static styles = [sharedStyles];

	render() {
		return html`<section>
			<h1 id="${this.id}">${this.keyword()}${this.name}</h1>
		</section> `;
	}

	heading() {
		return this.renderRoot.firstElementChild.firstElementChild;
	}

	// Private
	keyword() {
		return Utils.keyword(this.state);
	}
}

export { Heading };
