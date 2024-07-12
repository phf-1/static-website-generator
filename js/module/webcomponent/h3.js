import { html, css, LitElement } from "lit";
import { sharedStyles } from "./style";
import { Heading } from "./heading";

export class H3 extends Heading {
  static styles = [
    sharedStyles,
    css`
      section {
        padding-left: var(--x-h3-padding-left, 1rem);
      }

      h3 {
        display: table;
        font-size: var(--x-h3-font-size, 1.2rem);
        margin-top: 0;
        padding-top: var(--x-h3-padding-top, 1rem);
        line-height: var(--x-h3-line-height, 1.2);
        padding-bottom: var(--x-h3-padding-bottom, 0.1rem);
        border-bottom: 1px solid currentColor;
        margin-bottom: var(--x-h3-margin-bottom, 1.2rem);

        font-weight: var(--x-h3-font-weight, 400);
        font-family: var(--x-h3-font-family, sans-serif);
        color: var(--x-h3-color, black);
      }
    `,
  ];

  render() {
    return html`
      <section>
        <h3>${this.keyword()}${this.name}</h3>
        <slot></slot>
      </section>
    `;
  }
}
