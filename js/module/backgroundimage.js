/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const Backgroundimage = class extends EventTarget {
    // Public
    constructor(picture) {
        super();

        // Backgroundimage emits the event "updated" when its image has loaded.
        const image = document.getElementById("bg-image-img");
        this.#loaded = image.complete || image.naturalWidth !== 0;
        image.addEventListener("load", () => {
            this.#loaded = true;
            this.#emitUpdatedEvent({ loaded: this.#loaded });
        });

        // Backgroundimage emits the event "updated" when size has changed.
        this.#rect = picture.getBoundingClientRect();
        const observer = new ResizeObserver((entries) => {
            const rect = entries[0].contentRect;
            this.#rect = rect;
            this.#emitUpdatedEvent({ rect });
        });
        observer.observe(picture);
    }

    loaded() {
        return this.#loaded;
    }

    rect() {
        return this.#rect;
    }

    // Private
    #rect;
    #loaded;
    #emitUpdatedEvent(details = {}) {
        this.dispatchEvent(new CustomEvent("updated", details));
    }
};

export { Backgroundimage };
