/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


const Body = class {
	constructor(id) {
		this.id = id
	}

	start() {
		const img = document.getElementById(this.id)

		const show_body = function () {
			const body = document.getElementsByTagName('body')[0]
			body.style.visibility = "visible";
		}

		if (img.complete) {
			show_body()
		} else {
			img.addEventListener('load', show_body)
		}
	}
};


export { Body };
