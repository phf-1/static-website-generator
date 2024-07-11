import { html, css, LitElement } from 'lit';
import { Cartridge } from './cartridge';

export class Method extends Cartridge {

  static styles = [
    Cartridge.styles,
    css`
	.method {
		background-color: var(--method-bg);
		border-color: var(--method-border);
	}

	.method::before {
		content: "Method";
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


