/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


const Container = class {
	constructor(bg_pic_id) {
		this.bg_pic_id = bg_pic_id
	}

	// Place the container relatively to the background image.
	start(container) {
		// The background image.
		const background_image = document.querySelector("#" + this.bg_pic_id);

		// Place the container relatively to the background image.
		const place_the_container = function (rect) {
			container.style.top = String(rect.height * 0.39) + "px";
			container.style.visibility = "visible";
		}

		// When the background_image is resized, place the container accordingly.
		this._resize = new ResizeObserver(function(entries) {
			const rect = entries[0].contentRect;
			place_the_container(rect)
		});
		this._resize.observe(background_image);
	}
};


export { Container };
