import { html, css } from "lit";
import { sharedStyles } from "./style";
import { Heading } from "./heading";

class H1 extends Heading {
    static styles = [
        sharedStyles,
        css`
            h1 {
                display: block;
                margin: var(--x-h1-margin, 10vh) auto;
                border-bottom: none;

                text-align: center;

                font-size: var(--x-h1-font-size, 2rem);
                font-weight: var(--x-h1-font-weight, 400);
                font-family: var(--x-h1-font-family, sans-serif);
                color: var(--x-h1-color, black);
            }
        `,
    ];

    render() {
        return html`
            <section>
                <h1>${this.keyword()}${this.name}</h1>
                <slot></slot>
            </section>
        `;
    }
}

customElements.define("x-h1", H1);
