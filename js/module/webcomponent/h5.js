import { html, css, LitElement } from 'lit';
import { sharedStyles } from './style.js';

export class H5 extends LitElement {
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
    padding-left: var(--x-h5-padding-left, 1rem);
}

h5 {
	display: table;
	font-size: var(--x-h5-font-size, 1.2rem);
	margin-top: 0;
	padding-top: var(--x-h5-padding-top, 1rem);
	line-height: var(--x-h5-line-height, 1.2);
	padding-bottom: var(--x-h5-padding-bottom, 0.1rem);
	border-bottom: 1px solid currentColor;
	margin-bottom: var(--x-h5-margin-bottom, 1.2rem);

	font-weight: var(--x-h5-font-weight, 400);
    font-family: var(--x-h5-font-family, sans-serif);
	color: var(--x-h5-color, black);
}
`];


  render() {
    return html`
      <section>
        <h5>${this.name}</h5>
        <slot></slot>
      </section>
    `;
  }
}


