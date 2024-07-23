/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css, LitElement } from "lit";
import { sharedStyles } from "./style";

class TocHeading extends LitElement {
    static properties = {
        highlight: { type: Boolean, reflect: true },
        sid: {},
    };

    static styles = [
        sharedStyles,
        css`
            :host ::slotted(*) {
                padding: 0 0.1rem !important;
            }

            :host ::slotted(*:hover) {
                background-color: var(--x-toc-heading-hover-bg, red) !important;
                color: white;
            }

            :host([highlight]) ::slotted(*) {
                background-color: var(--x-toc-heading-highlight-bg, orange);
            }
        `,
    ];

    constructor(opt = {}) {
        super();
        this.highlight = opt.highlight || false;
    }

    // Public

    render() {
        return html`<a href="#${this.sid}"><slot></slot></a>`;
    }

    on() {
        this.highlight = true;
    }

    off() {
        this.highlight = false;
    }

    firstUpdated() {
        // The callback executed whenever the threshold is crossed.
        const callback = (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                this.on();
            } else {
                this.off();
            }
        };

        // when an intersection occurs, execute the callback.
        let options = {
            root: null, // viewport
            rootMargin: "0px",
            threshold: 0,
        };
        const observer = new IntersectionObserver(callback, options);
        const section = document.getElementById(this.sid);
        observer.observe(section); // callback is called now.
    }
}

customElements.define("x-toc-heading", TocHeading);
