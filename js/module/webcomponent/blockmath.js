import { html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import katex from "katex";
import { Cartridge } from "./cartridge";

export class Blockmath extends Cartridge {
  static properties = {
    _mathml: { state: true },
  };

  static styles = [
    Cartridge.styles,
    css`
      .blockmath {
        color: var(--x-blockmath-color, black);
        margin: var(--x-blockmath-margin, 2rem) auto;
        background-color: var(--x-blockmath-bg-color, white);
        border-color: var(--x-blockmath-border-color, black);
      }

      .blockmath::before {
        content: "Math";
        color: var(--x-blockmath-annotation-color, black);
      }
    `,
  ];

  constructor() {
    super();
    this._mathml = "";
  }

  render() {
    const content =
      this._mathml === "" ? html`<slot></slot>` : html`${this._mathml}`;
    return html`
      <div class="${Cartridge.css.class} blockmath">${content}</div>
    `;
  }

  firstUpdated() {
    const latex = String.raw`${this.shadowRoot.querySelector("slot").assignedNodes()[0].wholeText}`;
    this._mathml = unsafeHTML(
      katex.renderToString(latex, { output: "mathml" }),
    );
  }
}

customElements.define("x-blockmath", Blockmath);
