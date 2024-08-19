/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { html, css, LitElement } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import hljs from "highlight.js/lib/core";
import scheme from "highlight.js/lib/languages/scheme";
import elixir from "highlight.js/lib/languages/elixir";
import erlang from "highlight.js/lib/languages/erlang";
import xml from "highlight.js/lib/languages/xml";
import javascript from "highlight.js/lib/languages/javascript";
import plaintext from "highlight.js/lib/languages/plaintext";
import c from "highlight.js/lib/languages/c";
import python from "highlight.js/lib/languages/python";
import lean from "highlightjs-lean";
import { sharedStyles } from "../style";

hljs.registerLanguage("scheme", scheme);
hljs.registerLanguage("elixir", elixir);
hljs.registerLanguage("erlang", erlang);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("python", python);
hljs.registerLanguage("c", c);
hljs.registerLanguage("lean", lean);

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

class Blockcode extends LitElement {
    static properties = {
        _hihlighted: { state: true },
				_url_content: { state: true },
        lang: {},
				url: {},
    };

    // TODO: find a better way.
    static styles = [
        sharedStyles,
        css`
            pre code.hljs {
                display: block;
                overflow-x: auto;
                padding: var(--x-blockcode-padding, 1em);
            }
            code.hljs {
                padding: 3px 5px;
            }
            .hljs {
                color: #abb2bf;
                background: #282c34;
            }
            .hljs-comment,
            .hljs-quote {
                color: #5c6370;
                font-style: italic;
            }
            .hljs-doctag,
            .hljs-formula,
            .hljs-keyword {
                color: #c678dd;
            }
            .hljs-deletion,
            .hljs-name,
            .hljs-section,
            .hljs-selector-tag,
            .hljs-subst {
                color: #e06c75;
            }
            .hljs-literal {
                color: #56b6c2;
            }
            .hljs-addition,
            .hljs-attribute,
            .hljs-meta .hljs-string,
            .hljs-regexp,
            .hljs-string {
                color: #98c379;
            }
            .hljs-attr,
            .hljs-number,
            .hljs-selector-attr,
            .hljs-selector-class,
            .hljs-selector-pseudo,
            .hljs-template-variable,
            .hljs-type,
            .hljs-variable {
                color: #d19a66;
            }
            .hljs-bullet,
            .hljs-link,
            .hljs-meta,
            .hljs-selector-id,
            .hljs-symbol,
            .hljs-title {
                color: #61aeee;
            }
            .hljs-built_in,
            .hljs-class .hljs-title,
            .hljs-title.class_ {
                color: #e6c07b;
            }
            .hljs-emphasis {
                font-style: italic;
            }
            .hljs-strong {
                font-weight: 700;
            }
            .hljs-link {
                text-decoration: underline;
            }
        `,
        css`
            pre {
                margin: var(--x-blockcode-margin, 2rem 0);
            }
            code {
                font-family: var(--x-blockcode-font-family, "Mono");
                font-size: var(--x-blockcode-font-size, 0.75rem);
                border-radius: var(--x-blockcode-border-radius, 2px);
            }
        `,
    ];

    constructor() {
        super();
				this.lang = "";
				this.url = null;
        this._hihlighted = null;
				this._url_content = null;
    }

    render() {
        const res =
            this._hihlighted === null
                ? { content: html`<slot></slot>`, language: "" }
                : {
                    content: html`${unsafeHTML(this._hihlighted.value)}`,
                    language: this._hihlighted.language,
                };
        return html`<pre><code data-highlighted="yes" class="hljs ${res.language}">${res.content}</code></pre>`;
    }

    async firstUpdated() {
				const code = await this.#fetch_code()
        this._hihlighted = hljs.highlight(code, {
            language: this.lang || "plaintext",
            ignoreIllegals: true,
        });
    }

		async #fetch_code() {
				const url = this.url;
				if (url === null) {
						return remove_indentation(
								this.shadowRoot
										.querySelector("slot")
										.assignedNodes()[0]
										.wholeText.trimEnd(),
						);
				}
				else {
						const response = await fetch(url);
						if (!response.ok) {
								const msg = `Content from url has not been fetched. url: ${url}`
								throw new Error(msg)
						}
						return await response.text()
				}
		}
}

customElements.define("x-blockcode", Blockcode);
