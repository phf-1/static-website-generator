import { html, css, LitElement } from 'lit';
import { sharedStyles } from './style.js';

export class Keyword extends LitElement {
    static css = { class: "keyword" };

  static styles = [
    sharedStyles,
      css`
.keyword {
    font-family: "Mono";
    padding: 0 0.2em;
    margin-right: 0.5em;
    color: var(--main-bg);
    border-radius: var(--radius);
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.75em;
    background-color: var(--main-text);
}

.keyword::before {
    content: "todo";
}
`];

  render() {
      return html`<span class="${Keyword.css.class}"></span>`;
  }
}
