import { html, css, LitElement } from 'lit';
import { sharedStyles } from './style.js';

export class Cartridge extends LitElement {
    static css = { class: "cartridge" };

  static styles = [
    sharedStyles,
      css`
.cartridge {
  position: relative;
  width: 100%;
  margin: var(--sep-margin) auto;
  padding: 1rem;
  border-radius: var(--radius);
  border-top: 1px solid var(--annotation);
  border-bottom: 1px solid var(--annotation);
  background-color: var(--cartridge-bg);
  border-color: var(--cartridge-border);
}

.cartridge::before {
  content: "Cartridge";
  position: absolute;
  top: calc(-1*(1em + 1px + 0.75em));
  right: 0;
  font-size: 0.75em;
  color: var(--annotation);
}
`];

  constructor() {
      super();
  }

  render() {
    return html`
      <div class="cartridge">
        <slot></slot>
      </div>
    `;
  }
}
