/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css } from "lit";
import { Cartridge } from "./cartridge";

class Blockquote extends Cartridge {
    static properties = {
        author: {},
        url: {},
        source: {},
				id: {},
    };

    static styles = [
        Cartridge.styles,
        css`
            .blockquote {
                color: var(--x-blockquote-color, black);
                background-color: var(--x-blockquote-bg-color, white);
                border-color: var(--x-blockquote-border-color, black);
            }

            .blockquote::before {
                content: "Quote";
                color: var(--x-blockquote-annotation-color, black);
            }

            footer {
                margin-top: 1rem;
                text-align: right;
                font-size: var(--x-blockquote-footer-font-size, 0.875rem);
                color: var(--x-blockquote-color, black);
            }
        `,
    ];

    constructor() {
        super();
        this.author = "AUTHOR";
        this.source = "SOURCE";
        this.url = "https://example.com";
				this.id = ""
    }

    render() {
        return html`
            <blockquote class="${Cartridge.css.class} blockquote">
                <slot></slot>
                <footer>
                    — ${this.author},
                    <cite><a href="${this.url}">${this.source}</a></cite>
                </footer>
            </blockquote>
        `;
    }
}

customElements.define("x-blockquote", Blockquote);
