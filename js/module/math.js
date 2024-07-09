/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


import katex from 'katex';


const Math = class {
	constructor() {

	}

	/*
	 * For all math element under content, render it to MathML.
	 *
	 * content : Node
	 */
	start(content) {
		const math_elements = Array.from(content.getElementsByClassName('math'));
		const render_element = function (el) {
			katex.render(el.textContent, el, { output: "mathml" });
		}
		math_elements.forEach(render_element)		
	}
}


export { Math };
