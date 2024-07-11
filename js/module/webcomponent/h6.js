import { html, css, LitElement } from 'lit';
import { sharedStyles } from './style.js';

// TODO: factorize h1,h2,…
export class H6 extends LitElement {
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
    padding-left: var(--x-h6-padding-left, 1rem);
}

h6 {
	display: table;
	font-size: var(--x-h6-font-size, 1.2rem);
	margin-top: 0;
	padding-top: var(--x-h6-padding-top, 1rem);
	line-height: var(--x-h6-line-height, 1.2);
	padding-bottom: var(--x-h6-padding-bottom, 0.1rem);
	border-bottom: 1px solid currentColor;
	margin-bottom: var(--x-h6-margin-bottom, 1.2rem);

	font-weight: var(--x-h6-font-weight, 400);
    font-family: var(--x-h6-font-family, sans-serif);
	color: var(--x-h6-color, black);
}
`];


  render() {
    return html`
      <section>
        <h6>${this.name}</h6>
        <slot></slot>
      </section>
    `;
  }
}


