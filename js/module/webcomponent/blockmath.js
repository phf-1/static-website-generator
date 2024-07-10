import { html, css, LitElement } from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import katex from 'katex';
import { Cartridge } from './cartridge';

export class Blockmath extends Cartridge {

	static properties = {
		_mathml: {state: true}
	}

	static styles = [
		Cartridge.styles,
		css`
	.math {
		background-color: var(--math-bg);
		border-color: var(--math-border);
	}

	.math::before {
		content: "Math";
	}
	`
	];

	constructor() {
		super();
		this._mathml = ""
	}

	render() {
		const content = this._mathml === "" ?  html`<slot></slot>` : html`${this._mathml}`;
		return html`
<div class="${Cartridge.css.class} math">
  (WIP: WebComponent)
  ${content}
</div>
`;
	}

	firstUpdated(changedProperties) {
		const latex = this.shadowRoot.querySelector("slot").assignedNodes()[0].wholeText;
		this._mathml = unsafeHTML(katex.renderToString(latex, { output: "mathml" }))
	}
}
