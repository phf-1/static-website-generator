/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const Body = class {
  // Public
  constructor(body) {
    this.#body = body;
  }

  show() {
    this.#body.style.visibility = "visible";
  }

  // Private
  #body;
};

export { Body };
