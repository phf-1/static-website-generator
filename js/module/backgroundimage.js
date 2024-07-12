/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const Backgroundimage = class extends EventTarget {
  // Public
  constructor(picture) {
    super();
    this.#picture = picture;
    this.#loaded = picture.complete || picture.naturalWidth !== 0;
    picture.addEventListener("load", () => {
      this.#loaded = true;
      this.#emitUpdatedEvent({ loaded: this.#loaded });
    });
    this.#observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      this.#emitUpdatedEvent({ rect });
    });
    this.#observer.observe(this.#picture);
  }

  loaded() {
    return this.#loaded;
  }

  rect() {
    return this.#picture.getBoundingClientRect();
  }

  // Private
  #ratio;
  #picture;
  #image;
  #observer;
  #loaded;

  #emitUpdatedEvent(details = {}) {
    this.dispatchEvent(new CustomEvent("updated", details));
  }
};

export { Backgroundimage };
