import { html, css, LitElement } from 'lit';
import { Cartridge } from './cartridge';

export class Algorithm extends Cartridge {

  static styles = [
    Cartridge.styles,
    css`
	.algorithm {
		background-color: var(--algorithm-bg);
		border-color: var(--algorithm-border);
	}

	.algorithm::before {
		content: "Algorithm";
	}
    `
  ];

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="${Cartridge.css.class} algorithm">
        <slot></slot>
      </div>
    `;
  }
}


