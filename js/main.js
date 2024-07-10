/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


import { Toc } from "./module/toc";
import { Theorem } from "./module/theorem";
import { Math } from "./module/math";
import { Highlight } from "./module/highlight";
import { Abstract } from "./module/abstract";
customElements.define('x-abstract', Abstract);
import { Note } from "./module/note";
customElements.define('x-note', Note);
import { H3 } from "./module/h3";
customElements.define('x-h3', H3);
import { Cartridge } from "./module/cartridge";
customElements.define('x-cartridge', Cartridge);

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
const Root = class {
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


const container_id = "container";
const content_id = "content";
const toggle_toc_btn_id = "toggle_toc_btn";
const bg_pic_id = "bg-image"
const bg_pic_img_id = "bg-image-img"


const theorem = new Theorem();
const highlight = new Highlight();
const toc = new Toc();
const math = new Math();
const container = new Container(bg_pic_id);
const root = new Root(bg_pic_img_id);


const on_dom_content_loaded = function (event) {
	container.start(document.getElementById(container_id));
	const content = document.getElementById(content_id);
	toc.start(
		content,
		document.getElementById(container_id),
		document.getElementById(toggle_toc_btn_id)
	);
	highlight.start(content);
	theorem.start(content);
	math.start(content);
	root.start()
};


document.addEventListener("DOMContentLoaded", on_dom_content_loaded);
