import { html, css, LitElement } from 'lit';
import { Cartridge } from './cartridge';

export class Result extends Cartridge {

  static styles = [
    Cartridge.styles,
    css`
	.result {
		background-color: var(--result-bg);
		border-color: var(--result-border);
	}

	.result::before {
		content: "Result";
	}
    `
  ];

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="${Cartridge.css.class} result">
        (WIP: WebComponent)
        <slot></slot>
      </div>
    `;
  }
}


