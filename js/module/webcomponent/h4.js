import { html, css, LitElement } from 'lit';
import { sharedStyles } from './style.js';

export class H4 extends LitElement {
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
        <h4>${this.name}</h4>
        <slot></slot>
      </section>
    `;
  }
}


