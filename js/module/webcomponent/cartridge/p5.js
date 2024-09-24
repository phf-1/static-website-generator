/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css, LitElement } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import mermaid from "p5/lib/p5.min.js";
import { sharedStyles } from "../style";

const remove_indentation = function (str) {
    // Split the string into an array of lines
    let lines = str.split("\n");

    // Check if there are any lines, return empty string if no lines
    if (lines.length === 0) {
        return "";
    }

    // Determine the indentation of the first non-empty line
    let firstLineIndent = lines[1].match(/^\s*/)[0].length;

    // Remove the guessed indentation from all lines
    let result = lines
        .slice(1)
        .map((line) => {
            // Remove the indentation based on the first line's indent length
            return line.substring(firstLineIndent);
        })
        .join("\n");

    return result;
};

class P5 extends LitElement {
    static properties = {
        _rendered: { state: true },
    };

    // TODO: find a better way.
    static styles = [
        sharedStyles,
        css`
            pre {
                margin: var(--x-P5-margin, 2rem 0);
            }
            code {
                font-family: var(--x-P5-font-family, "Mono");
                font-size: var(--x-P5-font-size, 0.75rem);
                border-radius: var(--x-P5-border-radius, 2px);
            }
        `,
    ];

    constructor() {
        super();
        this._rendered = null;
    }

    render() {
        const res =
            this._rendered === null
                ? html`<slot></slot>`
                : html`<pre class="mermaid">
${unsafeHTML(this._rendered)}</pre
                  >`;
        // return html`<pre class="mermaid">${this._rendered}</pre>`;
        return res;
    }

    async firstUpdated() {
        const code = remove_indentation(
            this.shadowRoot
                .querySelector("slot")
                .assignedNodes()[0]
                .wholeText.trimEnd(),
        );
        mermaid.initialize({ startOnLoad: false });
        const { svg } = await mermaid.render("", code);
        this._rendered = svg;
    }
}

customElements.define("x-p5", P5);
