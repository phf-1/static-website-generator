/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


import { Toc } from "./module/toc";
import { Theorem } from "./module/theorem";
import { Highlight } from "./module/highlight";


const container_id = "container";
const content_id = "content";
const toggle_toc_btn_id = "toggle_toc_btn";


const theorem = new Theorem();
const highlight = new Highlight();
const toc = new Toc();


const on_dom_content_loaded = function (event) {
	const content = document.getElementById(content_id);
	toc.start(
		content,
		document.getElementById(container_id),
		document.getElementById(toggle_toc_btn_id)
	);
	highlight.start(content);
	theorem.start(content);
};


document.addEventListener("DOMContentLoaded", on_dom_content_loaded);
