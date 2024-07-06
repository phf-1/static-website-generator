/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import hljs from 'highlight.js/lib/core';
import scheme from 'highlight.js/lib/languages/scheme';
import { main as main_id } from "./module/id";
import { content as content_id } from "./module/id";
import { toggle_toc_btn as toggle_toc_btn_id } from "./module/id";
import { is_h1 } from "./module/dom";
import { element_toc } from "./module/toc";
import { toggle_toc } from "./module/action";


// Position the toc in the page.
const position_toc = function (main, content, toc) {
	const content_rect = content.getBoundingClientRect();
	const content_children = Array.from(content.children);
	const h1 = content_children.find(is_h1);
	if (h1) {
		const h1_rect = h1.getBoundingClientRect();
		const h1_dy = h1_rect.y - content_rect.y;
		const toc_top_margin = h1_dy + h1.offsetHeight;
		toc.style.marginTop = String(toc_top_margin) + "px";
	}
};

const on_dom_content_loaded = (function (main_id, content_id) {
	return function (event) {
		const main = document.getElementById(main_id);
		const content = document.getElementById(content_id);
		const toc = element_toc(content);
		main.appendChild(toc);
		const toggle_toc_btn = document.getElementById(toggle_toc_btn_id);
		toggle_toc_btn.onclick = toggle_toc
		hljs.registerLanguage('scheme', scheme);
		hljs.highlightAll();
	};
})(main_id, content_id);

document.addEventListener("DOMContentLoaded", on_dom_content_loaded);
