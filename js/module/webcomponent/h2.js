import { html, css, LitElement } from 'lit';
import { sharedStyles } from './style.js';

export class H2 extends LitElement {
	static properties = {
		name: {}
	}

	constructor() {
		super();
		this.name = "Section name"
	}
	
	static styles = [
		sharedStyles,
		css`
section {
    padding-left: var(--x-h2-padding-left, 0);
}

h2 {
	display: table;
	font-size: var(--x-h2-font-size, 1.2rem);
	margin-top: 0;
	padding-top: var(--x-h2-padding-top, 1rem);
	line-height: var(--x-h2-line-height, 1.2);
	padding-bottom: var(--x-h2-padding-bottom, 0.1rem);
	border-bottom: 1px solid currentColor;
	margin-bottom: var(--x-h2-margin-bottom, 1.2rem);

	font-weight: var(--x-h2-font-weight, 400);
    font-family: var(--x-h2-font-family, sans-serif);
	color: var(--x-h2-color, black);
}
`];

  render() {
    return html`
      <section>
        <h2>${this.name}</h2>
        <slot></slot>
      </section>
    `;
  }
}


