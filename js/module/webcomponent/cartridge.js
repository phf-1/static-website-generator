import { html, css, LitElement } from "lit";
import { sharedStyles } from "./style.js";

export class Cartridge extends LitElement {
  static css = { class: "cartridge" };

  static styles = [
    sharedStyles,
    css`
      .cartridge {
        position: relative;
        width: 100%;
        margin: var(--x-cartridge-margin, 2rem) auto;
        padding: 1rem;
        border-radius: 2px;
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
