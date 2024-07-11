import { html, css, LitElement } from 'lit';
import { Cartridge } from './cartridge';

export class Blockquote extends Cartridge {

    static properties = {
        author: {},
        url: {},
        source: {}
    }

    static styles = [
        Cartridge.styles,
        css`
    .blockquote {
        font-style: italic;
        color: var(--main-text);
        background-color: var(--quote-bg);
        border-color: var(--quote-border);
    }

    .blockquote::before {
        content: "Quote";
    }

    footer {
        text-align: right;
        font-size: 0.875rem;
        color: var(--main-text);
    }
    `
    ];

    constructor() {
        super();
        this.author = "AUTHOR";
        this.url = "https://example.com";
        this.source = "SOURCE";
    }

    render() {
        return html`
      <blockquote class="${Cartridge.css.class} blockquote">
        <slot></slot>
        <footer>— ${this.author}, <cite><a href="${this.url}">${this.source}</a></cite></footer>
      </blockquote>
    `;
    }
}
