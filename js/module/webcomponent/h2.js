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
	
  static styles = [sharedStyles];

  render() {
    return html`
      <section>
        <h2>(WebComponent) ${this.name}</h2>
        <slot></slot>
      </section>
    `;
  }
}


