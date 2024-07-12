import { html, css } from "lit";
import { Keyword } from "./keyword";

class Waiting extends Keyword {
    static styles = [
        Keyword.styles,
        css`
            .waiting {
                background-color: var(--x-waiting-bg-color, orange);
            }

            .waiting::before {
                content: "waiting";
            }
        `,
    ];

    render() {
        return html`<span class="${Keyword.css.class} waiting"></span>`;
    }
}

customElements.define("x-waiting", Waiting);
