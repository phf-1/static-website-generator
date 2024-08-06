/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css, LitElement } from "lit";
import "./toc_heading";
import { sharedStyles } from "./style";

class Toc extends LitElement {
    static properties = {
        _showing: { state: true },
    };

    static styles = [
        sharedStyles,
        css`
            :host {
                position: absolute;
                display: block;
                right: 0;
                top: 4rem;
            }

            nav {
                padding: 0.5rem;
                min-width: 30ch;
                max-height: 80vh;
                overflow-y: auto;
                background-color: var(--x-toc-bg);
                border: var(--x-toc-border, grey);
                border-radius: var(--x-toc-radius, 2px);
            }

            h2,
            h3,
            h4,
            h5,
            h6 {
                font-family: "Sans";
                font-size: 0.9rem;
                font-weight: 400;
                & a {
                    padding: 0.1em;
                    margin-bottom: 0.4em;
                    font-weight: normal;
                    color: var(--link);
                }
                &.highlight {
                    background-color: var(--algorithm-bg);
                }
            }

            h2 {
                margin-left: 0em;
            }
            h3 {
                margin-left: 1em;
            }
            h4 {
                margin-left: 2em;
            }
            h5 {
                margin-left: 3em;
            }
            h6 {
                margin-left: 4rem;
            }

            i { display: none; }

            nav::before {
                content: "Contents";
                color: var(--x-toc-before, red);
            }

            @media (min-width: 180ch) {
                :host {
                    left: calc(70ch - 1.5rem - 1px);
                    top: 0;
                    right: initial;
                    min-width: 40ch;
                    max-height: 90vh;
                    box-shadow: var(--img-shadow);
                }

                :host nav {
                    border: none;
                    border-radius: 0;
                }
            }
        `,
    ];

    constructor(opt = {}) {
        super();
        this._toc = html``;
        this._showing = !!opt.showing;
    }

    // Public

    render() {
        return this._showing ? this._toc : html``;
    }

    toggle() {
        this._showing = !this._showing;
    }

    showing() {
        return this._showing;
    }

    init(el) {
        const sections = Array.from(
            el.querySelectorAll("x-h2,x-h3,x-h4,x-h5,x-h6"),
        );
        const section_to_toc_heading = (section) => {
            const target = section.heading();
            const heading = target.cloneNode();
            heading.innerHTML = target.innerHTML;
            return html`<x-toc-heading sid="${section.id}"
                >${heading}</x-toc-heading
            >`;
        };
        const toc_headings = sections.map(section_to_toc_heading);
        this._toc = this.#toc(toc_headings);
    }

    // Private

    #toc(toc_headings) {
        const join = (acc, toc_heading) => html`${acc} ${toc_heading}`;
        const list_elements = toc_headings.reduce(join, html``);
        return html`<nav>${list_elements}</nav>`;
    }
}

customElements.define("x-toc", Toc);
