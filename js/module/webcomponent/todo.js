import { html, css, LitElement } from 'lit';
import { Keyword } from './keyword';

export class Todo extends Keyword {

  static styles = [
    Keyword.styles,
    css`
.todo {
	background-color: var(--kw-todo);
}

.todo::before {
	content: "todo";
}
`
  ];

  render() {
    return html`<span class="${Keyword.css.class} todo"></span>`;
  }
}


