import { html, css, LitElement } from 'lit';
import { Cartridge } from './cartridge';

export class Method extends Cartridge {

  static styles = [
    Cartridge.styles,
    css`
.method {
    color: var(--x-method-color, black);
    margin: var(--x-method-margin, 2rem) auto;
    background-color: var(--x-method-bg-color, white);
    border-color: var(--x-method-border-color, black);
}

.method::before {
    content: "Method";
    color: var(--x-method-annotation-color, black);
}
`
  ];

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="${Cartridge.css.class} method">
        <slot></slot>
      </div>
    `;
  }
}


