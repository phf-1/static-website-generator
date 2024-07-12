import { html, css } from "lit";
import { sharedStyles } from "./style";
import { Heading } from "./heading";

export class H4 extends Heading {
  static styles = [
    sharedStyles,
    css`
      section {
        padding-left: var(--x-h4-padding-left, 1rem);
      }

      h4 {
        display: table;
        font-size: var(--x-h4-font-size, 1.2rem);
        margin-top: 0;
        padding-top: var(--x-h4-padding-top, 1rem);
        line-height: var(--x-h4-line-height, 1.2);
        padding-bottom: var(--x-h4-padding-bottom, 0.1rem);
        border-bottom: 1px solid currentColor;
        margin-bottom: var(--x-h4-margin-bottom, 1.2rem);

        font-weight: var(--x-h4-font-weight, 400);
        font-family: var(--x-h4-font-family, sans-serif);
        color: var(--x-h4-color, black);
      }
    `,
  ];

  render() {
    return html`
      <section>
        <h4>${this.keyword()}${this.name}</h4>
        <slot></slot>
      </section>
    `;
  }
}
