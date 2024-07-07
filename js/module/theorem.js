/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


const theorem_class = "theorem";
const theorem_top_class = theorem_class + " top" ;
const proof_class = "proof"


const find_theorems = function (el) {
	return Array.from(el.getElementsByClassName(theorem_top_class));
}


const equip = function (theorem) {
	const list_of_theorem = [theorem].concat(Array.from(theorem.getElementsByClassName(theorem_class)))
	const add_button = function (thm) {
		const actions = document.createElement("div");
		actions.classList.add("actions")
		thm.prepend(actions)

		const btn = document.createElement("button");
		btn.classList.add("button")
		btn.innerHTML = "+"
		const proof = thm.getElementsByClassName(proof_class)[0]
		const toggle_proof = function () {
			if (proof.checkVisibility()) {
				proof.style.display = "none";
			} else {
				proof.style.display = "block";
			}
		}
		btn.onclick = toggle_proof;
		actions.appendChild(btn)
	}

	list_of_theorem.forEach(add_button)
}


const Theorem = class {
	constructor() {

	}

	/*
	 * Complete the HTML markup of all theorems under a given element with GUI controls.
	 * These controls include:
	 * - A button to hide/show the proof associated with a given theorem.
	 *
	 * el : Node
	 */
	start(el) {
		const list_of_theorem = find_theorems(el);
		list_of_theorem.forEach(equip);
	}
};


export { Theorem };
