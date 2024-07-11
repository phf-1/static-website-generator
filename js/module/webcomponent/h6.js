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
	
  static styles = [sharedStyles];

  render() {
    return html`
      <section>
        <h6>${this.name}</h6>
        <slot></slot>
      </section>
    `;
  }
}


