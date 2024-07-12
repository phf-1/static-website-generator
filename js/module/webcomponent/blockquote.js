import { html, css } from "lit";
import { Cartridge } from "./cartridge";

export class Blockquote extends Cartridge {
  static properties = {
    author: {},
    url: {},
    source: {},
  };

  static styles = [
    Cartridge.styles,
    css`
      .blockquote {
        color: var(--x-blockquote-color, black);
        background-color: var(--x-blockquote-bg-color, white);
        border-color: var(--x-blockquote-border-color, black);
      }

      .blockquote::before {
        content: "Quote";
        color: var(--x-blockquote-annotation-color, black);
      }

      footer {
        text-align: right;
        font-size: 0.875rem;
        color: var(--x-blockquote-color, black);
      }
    `,
  ];

  constructor() {
    super();
    this.author = "AUTHOR";
    this.url = "https://example.com";
    this.source = "SOURCE";
  }

  render() {
    return html`
      <blockquote class="${Cartridge.css.class} blockquote">
        <slot></slot>
        <footer>
          — ${this.author},
          <cite><a href="${this.url}">${this.source}</a></cite>
        </footer>
      </blockquote>
    `;
  }
}
