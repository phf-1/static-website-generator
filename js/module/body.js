/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


const Body = class {
	constructor(bg_img_id) {
		this.bg_img_id = bg_img_id;
	}

	// When enough content is available, show the body of the document.
	start() {
		// The background image.
		const img = document.getElementById(this.bg_img_id);

		// Makes the body visible.
		const show_body = function () {
			document.body.style.visibility = "visible";
		}

		// When the bacground image is available, make the body visible.
		img.complete ? show_body() : img.addEventListener('load', show_body)
	}
};


export { Body };
