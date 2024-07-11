import { html, css, LitElement } from 'lit';
import { Keyword } from './keyword';

export class Waiting extends Keyword {

  static styles = [
    Keyword.styles,
    css`
.waiting {
	background-color: var(--kw-waiting);
}

.waiting::before {
	content: "waiting";
}
`
  ];

  render() {
    return html`<span class="${Keyword.css.class} waiting"></span>`;
  }
}


