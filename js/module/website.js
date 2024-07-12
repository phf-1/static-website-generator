/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import "./webcomponent/abstract";
import "./webcomponent/algorithm";
import "./webcomponent/blockcode";
import "./webcomponent/blockmath";
import "./webcomponent/blockquote";
import "./webcomponent/context";
import "./webcomponent/definition";
import "./webcomponent/doing";
import "./webcomponent/done";
import "./webcomponent/example";
import "./webcomponent/failed";
import "./webcomponent/h1";
import "./webcomponent/h2";
import "./webcomponent/h3";
import "./webcomponent/h4";
import "./webcomponent/h5";
import "./webcomponent/h6";
import "./webcomponent/math";
import "./webcomponent/method";
import "./webcomponent/note";
import "./webcomponent/objective";
import "./webcomponent/result";
import "./webcomponent/todo";
import "./webcomponent/waiting";
import { Toc } from "./toc";
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
  constructor() {
    document.addEventListener("DOMContentLoaded", () =>
      this.#on_dom_content_loaded(),
    );
  }

  // Private
  #body;
  #backgroundimage;
  #container;
  #toc;

  #on_dom_content_loaded() {
    // Connect the body and the background image.
    this.#body = new Body(document.body);
    this.#backgroundimage = new Backgroundimage(
      document.getElementById(bg_pic_id),
    );
    this.#body_backgroundimage();
    this.#backgroundimage.addEventListener("updated", () =>
      this.#body_backgroundimage(),
    );

    // Connect the container and the background image.
    this.#container = new Container(document.getElementById(container_id));
    this.#container_backgroundimage();
    this.#backgroundimage.addEventListener("updated", () =>
      this.#container_backgroundimage(),
    );

    // Build the toc from the content.
    this.#toc = new Toc(document.getElementById(content_id));
    const container_el = document.getElementById(container_id);

    // Connect the toc and the container.
    container_el.appendChild(this.#toc.node());

    // Connect the nav button and the toc.
    document.getElementById(toggle_toc_btn_id).onclick = () =>
      this.#toc.toggle();

    // Experimental.
    this.theorem = new Theorem();
    const content = document.getElementById(content_id);
    this.theorem.start(content);
  }

  // Body and background image relation.
  #body_backgroundimage() {
    if (this.#backgroundimage.loaded()) {
      this.#body.show();
    }
  }

  // Container and background image relation.
  #container_backgroundimage() {
    if (this.#backgroundimage.loaded()) {
      this.#container.position(this.#backgroundimage.rect());
    }
  }
};

export { Website };
