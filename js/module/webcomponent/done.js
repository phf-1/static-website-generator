import { html, css } from "lit";
import { Keyword } from "./keyword";

export class Done extends Keyword {
  static styles = [
    Keyword.styles,
    css`
      .done {
        background-color: var(--x-done-bg-color, green);
      }

      .done::before {
        content: "done";
      }
    `,
  ];

  render() {
    return html`<span class="${Keyword.css.class} done"></span>`;
  }
}
