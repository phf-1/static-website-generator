/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


import { Toc } from "./module/toc";
import { Theorem } from "./module/theorem";
import { Container } from "./module/container";
import { Body } from "./module/body";
import { WebComponent } from "./module/webcomponent";


const container_id = "container";
const content_id = "content";
const toggle_toc_btn_id = "toggle_toc_btn";
const bg_pic_id = "bg-image"
const bg_pic_img_id = "bg-image-img"


const theorem = new Theorem();
const toc = new Toc();
const container = new Container(bg_pic_id);
const body = new Body(bg_pic_img_id);
const web_component = new WebComponent();


const on_dom_content_loaded = function (event) {
	const container_el = document.getElementById(container_id);
	container.start(container_el);
	const content = document.getElementById(content_id);
	toc.start(
		content,
		container_el,
		document.getElementById(toggle_toc_btn_id)
	);
	theorem.start(content);
	body.start()
};


web_component.start()
document.addEventListener("DOMContentLoaded", on_dom_content_loaded);
