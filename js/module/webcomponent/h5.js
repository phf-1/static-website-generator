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
	
  static styles = [sharedStyles];

  render() {
    return html`
      <section>
        <h5>(WebComponent) ${this.name}</h5>
        <slot></slot>
      </section>
    `;
  }
}


