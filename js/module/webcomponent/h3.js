import { html, css, LitElement } from 'lit';
import { sharedStyles } from './style.js';

export class H3 extends LitElement {
	static properties = {
		name: {}
	}

	constructor() {
		super();
		this.name = "Section name"
	}

  static styles = [sharedStyles];

  render() {
	return html`
	  <section>
		<h3>${this.name}</h3>
		<slot></slot>
	  </section>
	`;
  }
}
