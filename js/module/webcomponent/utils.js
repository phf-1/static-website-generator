import { html } from 'lit';

class Utils {
	static keyword (state) {
		switch (state) {
		case 'todo': return html`<x-todo></x-todo>`
		case 'doing': return html`<x-doing></x-doing>`
		case 'waiting': return html`<x-waiting></x-waiting>`
		case 'done': return html`<x-done></x-done>`
		case 'failed': return html`<x-failed></x-failed>`
		case null: return html``
		default:
			throw new Error(`Unexpected value.`)
		}
	}
}

export { Utils };
