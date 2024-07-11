/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


import { Abstract } from "./webcomponent/abstract";
import { Algorithm } from "./webcomponent/algorithm";
import { Blockquote } from "./webcomponent/blockquote";
import { Context } from "./webcomponent/context";
import { Definition } from "./webcomponent/definition";
import { Example } from "./webcomponent/example";
import { H3 } from "./webcomponent/h3";
import { Blockmath } from "./webcomponent/blockmath";
import { Math } from "./webcomponent/math";
import { Blockcode } from "./webcomponent/blockcode";
import { Method } from "./webcomponent/method";
import { Note } from "./webcomponent/note";
import { Objective } from "./webcomponent/objective";
import { Result } from "./webcomponent/result";
import { Todo } from "./webcomponent/todo";
import { Doing } from "./webcomponent/doing";
import { Waiting } from "./webcomponent/waiting";
import { Done } from "./webcomponent/done";
import { Failed } from "./webcomponent/failed";


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
		customElements.define('x-algorithm', Algorithm);
		customElements.define('x-blockquote', Blockquote);
		customElements.define('x-blockcode', Blockcode);
		customElements.define('x-context', Context);
		customElements.define('x-definition', Definition);
		customElements.define('x-example', Example);
		customElements.define('x-method', Method);
		customElements.define('x-blockmath', Blockmath);
		customElements.define('x-math', Math);
		customElements.define('x-failed', Failed);
		customElements.define('x-done', Done);
		customElements.define('x-waiting', Waiting);
		customElements.define('x-doing', Doing);
		customElements.define('x-todo', Todo);
		customElements.define('x-objective', Objective);
		customElements.define('x-result', Result);
	}
}


export { WebComponent };
