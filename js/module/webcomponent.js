/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


import { Abstract } from "./webcomponent/abstract";
import { Algorithm } from "./webcomponent/algorithm";
import { Blockquote } from "./webcomponent/blockquote";
import { Cartridge } from "./webcomponent/cartridge";
import { Context } from "./webcomponent/context";
import { Definition } from "./webcomponent/definition";
import { Example } from "./webcomponent/example";
import { H3 } from "./webcomponent/h3";
import { Blockmath } from "./webcomponent/blockmath";
import { Math } from "./webcomponent/math";
import { Method } from "./webcomponent/method";
import { Note } from "./webcomponent/note";
import { Objective } from "./webcomponent/objective";
import { Result } from "./webcomponent/result";


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
		customElements.define('x-algorithm', Algorithm);
		customElements.define('x-blockquote', Blockquote);
		customElements.define('x-context', Context);
		customElements.define('x-definition', Definition);
		customElements.define('x-example', Example);
		customElements.define('x-method', Method);
		customElements.define('x-blockmath', Blockmath);
		customElements.define('x-math', Math);
		customElements.define('x-objective', Objective);
		customElements.define('x-result', Result);
	}
}


export { WebComponent };
