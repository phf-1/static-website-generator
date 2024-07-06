/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const Heading = ["H1", "H2", "H3", "H4", "H5", "H6"];

const is_h1 = (el) => el.tagName === Heading[0];

const is_heading = (el) => Heading.includes(el.tagName);

const children_depth_first = (function () {
	const concat = (arr1, arr2) => arr1.concat(arr2);
	const phi = (el) => concat([el], children_depth_first(el));
	return (el) => Array.from(el.children).map(phi).reduce(concat, []);
})();

export { is_heading, is_h1, children_depth_first };
