/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


import hljs from 'highlight.js/lib/core';
import scheme from 'highlight.js/lib/languages/scheme';
import lean from 'highlightjs-lean';


const Code = class {
	constructor() {
		hljs.registerLanguage('scheme', scheme);
		hljs.registerLanguage('lean', lean);
	}

	/*
	 * Highlight all $CODE within <pre><code>$CODE</code></pre> under a given element.
	 *
	 * el : Node
	 */
	start(el) {
		hljs.highlightAll();
	}
}


export { Code };
