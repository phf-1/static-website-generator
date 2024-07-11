import { html, css, LitElement } from 'lit';
import { Keyword } from './keyword';

export class Done extends Keyword {

  static styles = [
    Keyword.styles,
    css`
.done {
	background-color: var(--kw-done);
}

.done::before {
	content: "done";
}
`
  ];

  render() {
    return html`<span class="${Keyword.css.class} done">(WIP: WebComponent)</span>`;
  }
}


