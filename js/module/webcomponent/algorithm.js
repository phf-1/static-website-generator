import { html, css } from "lit";
import { Cartridge } from "./cartridge";

export class Algorithm extends Cartridge {
  static styles = [
    Cartridge.styles,
    css`
      .algorithm {
        color: var(--x-algorithm-color, black);
        margin: var(--x-algorithm-margin, 2rem) auto;
        background-color: var(--x-algorithm-bg-color, white);
        border-color: var(--x-algorithm-border-color, black);
      }

      .algorithm::before {
        content: "Algorithm";
        color: var(--x-algorithm-annotation-color, black);
      }
    `,
  ];

  render() {
    return html`
      <div class="${Cartridge.css.class} algorithm">
        <slot></slot>
      </div>
    `;
  }
}
