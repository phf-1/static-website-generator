import { html, css } from "lit";
import { Cartridge } from "./cartridge";

export class Objective extends Cartridge {
  static styles = [
    Cartridge.styles,
    css`
      .objective {
        color: var(--x-objective-color, black);
        margin: var(--x-objective-margin, 2rem) auto;
        background-color: var(--x-objective-bg-color, white);
        border-color: var(--x-objective-border-color, black);
      }

      .objective::before {
        content: "Objective";
        color: var(--x-objective-annotation-color, black);
      }
    `,
  ];

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="${Cartridge.css.class} objective">
        <slot></slot>
      </div>
    `;
  }
}
