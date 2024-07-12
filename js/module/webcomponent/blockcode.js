import { html, css, LitElement } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import hljs from "highlight.js/lib/core";
import scheme from "highlight.js/lib/languages/scheme";
import c from "highlight.js/lib/languages/c";
import python from "highlight.js/lib/languages/python";
import lean from "highlightjs-lean";
import { sharedStyles } from "./style.js";

hljs.registerLanguage("scheme", scheme);
hljs.registerLanguage("python", python);
hljs.registerLanguage("c", c);
hljs.registerLanguage("lean", lean);

class Blockcode extends LitElement {
  static properties = {
    _hihlighted: { state: true },
  };

  // TODO: find a better way.
  static styles = [
    sharedStyles,
    css`
      pre code.hljs {
        display: block;
        overflow-x: auto;
        padding: 1em;
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
        margin: 4rem 0;
      }
      code {
        font-family: "Mono";
        font-size: 0.8rem;
        border-radius: 2px;
      }
    `,
  ];

  constructor() {
    super();
    this._hihlighted = null;
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

  firstUpdated() {
    const code = this.shadowRoot
      .querySelector("slot")
      .assignedNodes()[0]
      .wholeText.trim();
    this._hihlighted = hljs.highlightAuto(code);
  }
}

customElements.define("x-blockcode", Blockcode);
