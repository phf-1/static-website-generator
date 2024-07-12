import { html, css } from "lit";
import { Keyword } from "./keyword";

class Doing extends Keyword {
  static styles = [
    Keyword.styles,
    css`
      .doing {
        background-color: var(--x-doing-bg-color, orange);
      }

      .doing::before {
        content: "doing";
      }
    `,
  ];

  render() {
    return html`<span class="${Keyword.css.class} doing"></span>`;
  }
}

customElements.define("x-doing", Doing);
