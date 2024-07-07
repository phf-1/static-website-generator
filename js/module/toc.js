/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


import { is_heading } from "./dom";


const toc_id = "table-of-content"


/*
 * Toggle the display value of an element between none and block.
 *
 * el : Node
 */
const toggle_toc = function (el) {
	return function() {
		if (el.checkVisibility()) {
			el.style.display = "none";
		} else {
			el.style.display = "block";
		}
	}
};


/*
 * Return a new id for each invocation.
 *
 * id_build() : Int
 */
const id_build = (function () {
	let id = 0;
	return () => { id = id + 1; return id; };
})();


/*
 * Build a table of content from a list of headings.
 *
 * Heading ≡ h1 | … | h6
 * toc_build : List Heading → Toc
 */
const toc_build = function (headings) {
	const toc = document.createElement("nav");
	toc.id = toc_id;
	const add_heading_to_toc = function (heading) {
		const toc_heading = heading.cloneNode();
		heading.id = heading.id === "" ? id_build() : heading.id;
		const a = document.createElement("a");
		a.href = "#" + heading.id;
		a.innerHTML = heading.innerHTML;
		toc_heading.appendChild(a);
		toc.appendChild(toc_heading);
	};
	headings.forEach(add_heading_to_toc);
	return toc;
};


/*
 * Build a table of content from an arbitrary node.
 *
 * element_toc : Node → Toc
 */
const element_toc = function (element) {
	const headings = Array.from(element.getElementsByTagName('*')).filter(is_heading);
	return toc_build(headings);
};


const Toc = class {
	constructor() {

	}

	/*
	 * Builds a table of content from a given element and adds it to a parent
	 * element. Adds the meaning "toggle the table of content" to a button when
	 * clicked.
	 *
	 * content : Node
	 * parent : Node
	 * button : Button
	 */
	start(element, parent, button) {
		const toc = element_toc(element)
		parent.appendChild(toc);
		button.onclick = toggle_toc(toc);
	}
}


export { Toc };
