/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * On page load — for instance, after: <script type="module" src="/js/main.min.js"></script> — this code loads ; it is
 * the entry point.
 */
import { Website } from "./module/website";
const website = new Website();
document.addEventListener("DOMContentLoaded", () => website.start());
