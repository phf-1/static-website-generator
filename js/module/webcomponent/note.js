import { html, css, LitElement } from 'lit';
import { Cartridge } from './cartridge';

export class Note extends Cartridge {

  static styles = [
    Cartridge.styles,
    css`
	.note {
		background-color: var(--note-bg);
		border-color: var(--note-border);
	}

	.note::before {
		content: "Note";
	}
    `
  ];

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="${Cartridge.css.class} note">
        <slot></slot>
      </div>
    `;
  }
}


