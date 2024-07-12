/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const Container = class {
    // Public
    constructor(container) {
        this.#container = container;
    }

    position(rect) {
        this.#container.style.top = String(-rect.height * 0.61) + "px";
    }

    // Private
    #container;
};

export { Container };
