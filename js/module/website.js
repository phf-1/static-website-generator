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
const toggle_qa_btn_id = "toggle_qa";
const bg_pic_id = "bg-image";

const Website = class {
    constructor() {}

    // Public
    //
    // The web page is viewed as a network of actors.
    // The network is built in order, e.g. :
    //   1. body is built
    //   2. background_image is built
    //   3. website ─ background_image ─ body
    //   4. container is built
    //   5. website ─ background_image ┬ body
    //                                 └ container
    //   6. content is built
    //   7. toc is built
    //   9. website ┬ background_image ┬ body
    //              │                  └ container
    //              └ content ─ toc
    start() {
        // body
        const body = new Body(document.body);

        // background_image
        const bgimage = new Backgroundimage(document.getElementById(bg_pic_id));

        // background_image — body
        //
        // If the background image is loaded, then: show the body.
        const body_image = () => {
            bgimage.loaded() && body.show();
        };
        body_image();
        bgimage.addEventListener("updated", body_image);

        // container
        const container = new Container(document.getElementById(container_id));

        // background_image — container.
        //
        // If the background image is loaded, then: position the container w.r.t. the image.
        const container_image = () => {
            bgimage.loaded() && container.position(bgimage.rect());
        };
        container_image();
        bgimage.addEventListener("updated", container_image);

        // content
        const content = document.getElementById(content_id);

        // toc
        const x_toc = document.getElementsByTagName("x-toc")[0];

        // content — toc
        //
        // Because of different behaviours on iOS and other systems, we must give
        // time to the shadowDOM to reach a « stable » state before building the TOC
        // from it. Lifecycles hooks like firstUpdated do not work uniformly.
        setTimeout(() => {
            x_toc.init(content);
        }, 500);

        // toc_btn
        const toc_btn = document.getElementById(toggle_toc_btn_id);

        // toc_btn — toc
        //
        // If the TOC button is clicked, then: toggle the TOC.
        toc_btn.addEventListener("click", () => {
            x_toc.toggle();
        });

        // toggle_qa_btn
        const toggle_qa_btn = document.getElementById(toggle_qa_btn_id);

        // toggle_qa_btn — { qa }
        //
        // If the toggle QA button is clicked, then: all answers of QA are toggled.
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
                    toggle_qa_btn.innerHTML = "SHOW";
                } else {
                    qa_list.map((qa) => qa.show());
                    toggle_qa_btn.innerHTML = "HIDE";
                }
            };
            toggle_qa_btn.addEventListener("click", () => {
                toggle_all_qa();
            });
        }

        // Experimental.
        this.theorem = new Theorem();
        this.theorem.start(content);
    }
};

export { Website };
