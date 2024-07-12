import { html, css } from "lit";
import { Keyword } from "./keyword";

class Failed extends Keyword {
    static styles = [
        Keyword.styles,
        css`
            .failed {
                background-color: var(--x-failed-bg-color, black);
            }

            .failed::before {
                content: "failed";
            }
        `,
    ];

    render() {
        return html`<span class="${Keyword.css.class} failed"></span>`;
    }
}

customElements.define("x-failed", Failed);
