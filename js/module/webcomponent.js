/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


import { Note } from "./webcomponent/note";
import { Abstract } from "./webcomponent/abstract";
import { H3 } from "./webcomponent/h3";
import { Cartridge } from "./webcomponent/cartridge";


const WebComponent = class {
	constructor() {

	}

	/*
	 * Define all Web Components.
	 *
	 */
	start(content) {
		customElements.define('x-abstract', Abstract);
		customElements.define('x-note', Note);
		customElements.define('x-h3', H3);
		customElements.define('x-cartridge', Cartridge);
	}
}


export { WebComponent };
