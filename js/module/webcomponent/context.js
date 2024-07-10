import { html, css, LitElement } from 'lit';
import { Cartridge } from './cartridge';

export class Context extends Cartridge {

  static styles = [
    Cartridge.styles,
    css`
	.context {
		background-color: var(--context-bg);
		border-color: var(--context-border);
	}

	.context::before {
		content: "Context";
	}
    `
  ];

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="${Cartridge.css.class} context">
        (WIP: WebComponent)
        <slot></slot>
      </div>
    `;
  }
}


