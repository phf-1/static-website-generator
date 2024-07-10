import { html, css, LitElement } from 'lit';
import { sharedStyles } from './style.js';

export class H3 extends LitElement {
 static properties = {
    name: "H3",
  };

  static styles = [sharedStyles];

  constructor() {
      super();
  }

  render() {
    return html`
      <section>
        <h3>(WebComponent) ${this.name}</h3>
        <slot></slot>
      </section>
    `;
  }
}


