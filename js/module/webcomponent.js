/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


import { Abstract } from "./webcomponent/abstract";
import { Algorithm } from "./webcomponent/algorithm";
import { Blockcode } from "./webcomponent/blockcode";
import { Blockmath } from "./webcomponent/blockmath";
import { Blockquote } from "./webcomponent/blockquote";
import { Context } from "./webcomponent/context";
import { Definition } from "./webcomponent/definition";
import { Doing } from "./webcomponent/doing";
import { Done } from "./webcomponent/done";
import { Example } from "./webcomponent/example";
import { Failed } from "./webcomponent/failed";
import { H1 } from "./webcomponent/h1";
import { H2 } from "./webcomponent/h2";
import { H3 } from "./webcomponent/h3";
import { H4 } from "./webcomponent/h4";
import { H5 } from "./webcomponent/h5";
import { H6 } from "./webcomponent/h6";
import { Math } from "./webcomponent/math";
import { Method } from "./webcomponent/method";
import { Note } from "./webcomponent/note";
import { Objective } from "./webcomponent/objective";
import { Result } from "./webcomponent/result";
import { Todo } from "./webcomponent/todo";
import { Waiting } from "./webcomponent/waiting";


const WebComponent = class {
	constructor() {

	}

	/*
	 * Define all Web Components.
	 *
	 */
	start(content) {
		customElements.define('x-abstract', Abstract);
		customElements.define('x-algorithm', Algorithm);
		customElements.define('x-blockcode', Blockcode);
		customElements.define('x-blockmath', Blockmath);
		customElements.define('x-blockquote', Blockquote);
		customElements.define('x-context', Context);
		customElements.define('x-definition', Definition);
		customElements.define('x-doing', Doing);
		customElements.define('x-done', Done);
		customElements.define('x-example', Example);
		customElements.define('x-failed', Failed);
		customElements.define('x-h1', H1);		
		customElements.define('x-h2', H2);
		customElements.define('x-h3', H3);
		customElements.define('x-h4', H4);
		customElements.define('x-h5', H5);
		customElements.define('x-h6', H6);		
		customElements.define('x-math', Math);
		customElements.define('x-method', Method);
		customElements.define('x-note', Note);
		customElements.define('x-objective', Objective);
		customElements.define('x-result', Result);
		customElements.define('x-todo', Todo);
		customElements.define('x-waiting', Waiting);
	}
}


export { WebComponent };
