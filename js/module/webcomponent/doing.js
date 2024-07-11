import { html, css, LitElement } from 'lit';
import { Keyword } from './keyword';

export class Doing extends Keyword {

  static styles = [
    Keyword.styles,
    css`
.doing {
	background-color: var(--kw-doing);
}

.doing::before {
	content: "doing";
}
`
  ];

  render() {
    return html`<span class="${Keyword.css.class} doing"></span>`;
  }
}


