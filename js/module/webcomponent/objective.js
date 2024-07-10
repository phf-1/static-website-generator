import { html, css, LitElement } from 'lit';
import { Cartridge } from './cartridge';

export class Objective extends Cartridge {

  static styles = [
    Cartridge.styles,
    css`
	.objective {
		background-color: var(--objective-bg);
		border-color: var(--objective-border);
	}

	.objective::before {
		content: "Objective";
	}
    `
  ];

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="${Cartridge.css.class} objective">
        (WIP: WebComponent)
        <slot></slot>
      </div>
    `;
  }
}


