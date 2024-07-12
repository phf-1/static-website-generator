import { html, css } from "lit";
import { Keyword } from "./keyword";

class Todo extends Keyword {
    static styles = [
        Keyword.styles,
        css`
            .todo {
                background-color: var(--x-todo-bg-color, red);
            }

            .todo::before {
                content: "todo";
            }
        `,
    ];

    render() {
        return html`<span class="${Keyword.css.class} todo"></span>`;
    }
}

customElements.define("x-todo", Todo);
