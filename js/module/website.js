/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * HTML files are viewed as data structures which processes get a hold off. For
 * instance, <x-abstract> ... </x-abstract> is a WebComponent after the JS code is
 * loaded — i.e. has data, behavior, and communication capacities. These objects are
 * called "components".
 *
 * This section loads all available components.
 */
import "./webcomponent/cartridge/abstract";
import "./webcomponent/cartridge/algorithm";
import "./webcomponent/cartridge/answer";
import "./webcomponent/cartridge/blockcode";
// import "./webcomponent/cartridge/blockdiagram";
// import "./webcomponent/cartridge/p5";
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

/**
 * HTML element IDs in the template that exist in all pages.
 * These IDs are used to build components.
 */
const container_id = "container";
const content_id = "content";
const toggle_toc_btn_id = "toggle_toc_btn";
const toggle_qa_btn_id = "toggle_qa";
const bg_pic_id = "bg-image";

/**
 * Class representing a Website as a component.
 *
 * The website is formed by a network of components that are connected by references.
 * Components exchange messages; if component A references component B,
 * B.aMessage(…) is interpreted as "B received the message `aMessage' with parameters
 * `…' sent by A."
 *
 * @class
 * @extends EventTarget
 */
const Website = class extends EventTarget {
    start() {
        const body = new Body(document.body);
        const bgimage = new Backgroundimage(document.getElementById(bg_pic_id));
        const body_image = () => {
            bgimage.loaded() && body.show();
        };
        body_image();
        bgimage.addEventListener("updated", body_image);

        const container = new Container(document.getElementById(container_id));
        const container_image = () => {
            bgimage.loaded() && container.position(bgimage.rect());
        };
        container_image();
        bgimage.addEventListener("updated", container_image);

        const content = document.getElementById(content_id);
        const x_toc = document.getElementsByTagName("x-toc")[0];

        // Set a timeout to initialize the TOC after shadowDOM reaches a stable state.
        setTimeout(() => {
            x_toc.init(content);
        }, 500);

        const toc_btn = document.getElementById(toggle_toc_btn_id);
        toc_btn.addEventListener("click", () => {
            x_toc.toggle();
        });

        const toggle_qa_btn = document.getElementById(toggle_qa_btn_id);
        const qa_list = Array.from(document.getElementsByTagName("x-qa"));

        if (qa_list.length == 0) {
            toggle_qa_btn.style.display = "none";
        } else {
            const toggle_all_qa = function () {
                const all_qa_are_visible = qa_list.every((qa) =>
                    qa.is_visible(),
                );
                if (all_qa_are_visible) {
                    qa_list.map((qa) => qa.hide());
                    toggle_qa_btn.innerHTML = "SHOW ANSWERS";
                } else {
                    qa_list.map((qa) => qa.show());
                    toggle_qa_btn.innerHTML = "HIDE ANSWERS";
                }
            };

            toggle_qa_btn.addEventListener("click", () => {
                toggle_all_qa();
            });
        }

        // Experimental theorem component initialization
        this.theorem = new Theorem();
        this.theorem.start(content);
    }
};

export { Website };
