import { html, css, LitElement } from 'lit';
import { sharedStyles } from './style.js';

export class Abstract extends LitElement {

  static styles = [
    sharedStyles,
    css`
      .cartridge.abstract {
        font-size: 0.9em;
        background-color: var(--abstract-bg);
        border-color: var(--abstract-border);
        max-width: 70%;
        margin: 15vh auto;
      }

      .cartridge.abstract::before {
        content: "Abstract";
      }
    `
  ];

  constructor() {
    super();
  }

  render() {
    return html`
      <p class="cartridge abstract">
        (WIP: WebComponent)
        <slot></slot>
      </p>
    `;
  }
}


