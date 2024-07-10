import { html, css, LitElement } from 'lit';
import { Cartridge } from './cartridge';

export class Abstract extends Cartridge {

  static styles = [
    Cartridge.styles,
    css`
	.abstract {
        font-size: 0.9em;
		background-color: var(--abstract-bg);
		border-color: var(--abstract-border);
        max-width: 70%;
        margin: 15vh auto;
	}

	.abstract::before {
		content: "Abstract";
	}
    `
  ];

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="${Cartridge.css.class} abstract">
        (WIP: WebComponent)
        <slot></slot>
      </div>
    `;
  }
}


