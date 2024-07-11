import { html, css, LitElement } from 'lit';
import { Cartridge } from './cartridge';

export class Example extends Cartridge {

  static styles = [
    Cartridge.styles,
    css`
	.example {
		background-color: var(--example-bg);
		border-color: var(--example-border);
	}

	.example::before {
		content: "Example";
	}
    `
  ];

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="${Cartridge.css.class} example">
        <slot></slot>
      </div>
    `;
  }
}


