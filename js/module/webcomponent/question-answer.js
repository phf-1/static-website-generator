import { html, css, LitElement } from "lit";
import { sharedStyles } from "./style";

class QuestionAnswer extends LitElement {
	static styles = [
		sharedStyles,
		css`
			.question-answer {
				margin: var(--x-qa-margin, 4rem) 0;
			}
			.question-answer .actions {
				display: flex;
				justify-content: right;
				gap: 1rem;
			}
			.question-answer .content {
				display: flex;
				flex-direction: column;
			}
		`,
	];

	render() {
		return html`
			<div class="question-answer">
				<div class="content">
					<slot></slot>
				</div>
				<div class="actions">
					<button class="button" @click="${this._show}">SHOW</button
					><button class="button" @click="${this._hide}">HIDE</button>
				</div>
			</div>
		`;
	}

	_answers() {
		return this.shadowRoot
			.querySelector("slot")
			.assignedElements()
			.filter((el) => el.tagName === "X-A");
	}

	_show() {
		this._answers().forEach((answer) => answer.show());
	}

	_hide() {
		this._answers().forEach((answer) => answer.hide());
	}
}

customElements.define("x-qa", QuestionAnswer);
