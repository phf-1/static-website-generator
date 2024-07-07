/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const Heading = ["H1", "H2", "H3", "H4", "H5", "H6"];

const is_h1 = (el) => el.tagName === Heading[0];

const is_heading = (el) => Heading.includes(el.tagName);

export { is_heading, is_h1 };
