import { html } from "lit";
import { Blockmath } from "./blockmath";

class Math extends Blockmath {
  render() {
    const content =
      this._mathml === "" ? html`<slot></slot>` : html`${this._mathml}`;
    return html`<span>${content}</span>`;
  }
}

customElements.define("x-math", Math);
