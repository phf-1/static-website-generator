/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css, LitElement } from "lit";
import { sharedStyles } from "../style";

export class Cartridge extends LitElement {
    static css = { class: "cartridge" };

    static styles = [
        sharedStyles,
        css`
            :host {
                --padding: var(--x-cartridge-padding, 1em 0.5em);
            }

            .cartridge {
                position: relative;
                width: 100%;
                margin: var(--x-cartridge-margin, 2rem auto);
                padding: var(--padding);
                border-radius: var(--x-cartridge-border-radius, 2px);
                border-top: 1px solid var(--x-cartridge-border-color, black);
                border-bottom: 1px solid var(--x-cartridge-border-color, black);
                background-color: var(--x-cartridge-bg-color, white);
            }

            .cartridge::before {
                content: "Cartridge";
                position: absolute;
                top: calc(-1 * (1em + 1px + 0.75em));
                left: 0;
                font-size: 0.75em;
                color: var(--x-cartridge-annotation-color, black);
            }
        `,
    ];

    render() {
        return html`
            <div class="${Cartridge.css.class}">
                <slot></slot>
            </div>
        `;
    }
}
