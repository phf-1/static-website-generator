import { html, css, LitElement } from 'lit';
import { sharedStyles } from './style';
import { Utils } from './utils';

class Heading extends LitElement {
	static properties = {
		name: {},
		state: {}
	}

	constructor() {
		super();
		this.name = "Section name"
		this.state = null
	}

	static styles = [sharedStyles];

	keyword () {
		return Utils.keyword(this.state);
	}

	render() {
		return html``;
	}
}

export { Heading };
