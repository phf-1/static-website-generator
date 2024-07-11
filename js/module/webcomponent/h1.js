import { html, css, LitElement } from 'lit';
import { sharedStyles } from './style.js';

export class H1 extends LitElement {
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
h1 {
	font-size: var(--title-font-size);
	display: block;
	text-align: center;
	border-bottom: none;
	margin: 10vh auto;
}
`];

	render() {
		return html`
      <section>
        <h1>${this.name}</h1>
        <slot></slot>
      </section>
    `;
	}
}


