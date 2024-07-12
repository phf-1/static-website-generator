import { html, css, LitElement } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import katex from "katex";
import { Blockmath } from "./blockmath";

export class Math extends Blockmath {
  render() {
    const content =
      this._mathml === "" ? html`<slot></slot>` : html`${this._mathml}`;
    return html`<span>${content}</span>`;
  }
}
