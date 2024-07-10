import { html, css, LitElement } from 'lit';
import { Cartridge } from './cartridge';

export class Definition extends Cartridge {

  static styles = [
    Cartridge.styles,
    css`
	.definition {
		background-color: var(--definition-bg);
		border-color: var(--definition-border);
	}

	.definition::before {
		content: "Definition";
	}
    `
  ];

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="${Cartridge.css.class} definition">
        (WIP: WebComponent)
        <slot></slot>
      </div>
    `;
  }
}


