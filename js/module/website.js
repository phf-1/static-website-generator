/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import "./webcomponent/cartridge/abstract";
import "./webcomponent/cartridge/algorithm";
import "./webcomponent/cartridge/answer";
import "./webcomponent/cartridge/blockcode";
import "./webcomponent/cartridge/blockmath";
import "./webcomponent/cartridge/blockquote";
import "./webcomponent/cartridge/context";
import "./webcomponent/cartridge/definition";
import "./webcomponent/cartridge/example";
import "./webcomponent/cartridge/method";
import "./webcomponent/cartridge/note";
import "./webcomponent/cartridge/objective";
import "./webcomponent/cartridge/question";
import "./webcomponent/cartridge/result";
import "./webcomponent/heading/h1";
import "./webcomponent/heading/h2";
import "./webcomponent/heading/h3";
import "./webcomponent/heading/h4";
import "./webcomponent/heading/h5";
import "./webcomponent/heading/h6";
import "./webcomponent/keyword/doing";
import "./webcomponent/keyword/done";
import "./webcomponent/keyword/failed";
import "./webcomponent/keyword/todo";
import "./webcomponent/keyword/waiting";
import "./webcomponent/math";
import "./webcomponent/question-answer";
import "./webcomponent/toc";
import { Theorem } from "./theorem";
import { Container } from "./container";
import { Body } from "./body";
import { Backgroundimage } from "./backgroundimage";

const container_id = "container";
const content_id = "content";
const toggle_toc_btn_id = "toggle_toc_btn";
const bg_pic_id = "bg-image";

const Website = class {
	// Public
	constructor() {}

	start() {
		// Build the body and background image processes.
		const body = new Body(document.body);
		const image = new Backgroundimage(document.getElementById(bg_pic_id));

		// Connect the body and the background image.
		const body_image = () => {
			image.loaded() && body.show();
		};
		body_image();
		image.addEventListener("updated", body_image);

		// Build the container process.
		const container_el = document.getElementById(container_id);
		const container = new Container(container_el);

		// Connect the container and the background image.
		const container_image = () => {
			image.loaded() && container.position(image.rect());
		};
		container_image();
		image.addEventListener("updated", container_image);

		// Build the toc process.
		const content = document.getElementById(content_id);
		const x_toc = document.getElementsByTagName("x-toc")[0];
		setTimeout(() => {
			x_toc.init(content);
		}, 500);

		// Connect the TOC and the document.
		const toc_btn = document.getElementById(toggle_toc_btn_id);
		const toc_btn_event = "click";
		const toc_btn_handler = function () {
			x_toc.toggle();
		};
		toc_btn.addEventListener(toc_btn_event, toc_btn_handler);

		// Experimental.
		this.theorem = new Theorem();
		this.theorem.start(content);
	}
};

export { Website };
