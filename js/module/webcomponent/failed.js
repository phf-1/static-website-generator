import { html, css, LitElement } from "lit";
import { Keyword } from "./keyword";

export class Failed extends Keyword {
  static styles = [
    Keyword.styles,
    css`
      .failed {
        background-color: var(--x-failed-bg-color, black);
      }

      .failed::before {
        content: "failed";
      }
    `,
  ];

  render() {
    return html`<span class="${Keyword.css.class} failed"></span>`;
  }
}
