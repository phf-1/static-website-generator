/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Objective extends Cartridge {
	static styles = [
		Cartridge.styles,
		css`
			.objective {
				color: var(--x-objective-color, black);
				margin: var(--x-cartridge-margin, 2rem auto);
				background-color: var(--x-objective-bg-color, white);
				border-color: var(--x-objective-border-color, black);
			}

			.objective::before {
				content: "Objective";
				color: var(--x-objective-annotation-color, black);
			}
		`,
	];

	render() {
		return html`
			<div class="${Cartridge.css.class} objective">
				<slot></slot>
			</div>
		`;
	}
}

customElements.define("x-objective", Objective);
