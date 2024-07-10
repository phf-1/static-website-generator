/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


const Container = class {
	constructor(bg_pic_id) {
		this.bg_pic_id = bg_pic_id
	}

	start(container) {
		this._resize = new ResizeObserver(function(entries) {
			const rect = entries[0].contentRect;
			container.style.top = String(rect.height * 0.39) + "px";
			container.style.visibility = "visible";
		});
		this._resize.observe(document.querySelector("#" + this.bg_pic_id));
	}
};


export { Container };
