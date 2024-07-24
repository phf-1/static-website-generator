/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Algorithm extends Cartridge {
	static styles = [
		Cartridge.styles,
		css`
			.algorithm {
				color: var(--x-algorithm-color, black);
				margin: var(--x-cartridge-margin, 2rem auto);
				background-color: var(--x-algorithm-bg-color, white);
				border-color: var(--x-algorithm-border-color, black);
			}

			.algorithm::before {
				content: "Algorithm";
				color: var(--x-algorithm-annotation-color, black);
			}
		`,
	];

	render() {
		return html`
			<div class="${Cartridge.css.class} algorithm">
				<slot></slot>
			</div>
		`;
	}
}

customElements.define("x-algorithm", Algorithm);
