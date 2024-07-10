// shared-styles.js
import { css } from 'lit';

export const sharedStyles = css`
  html {
    font-family: "Serif";
    color: var(--main-text);
    background: var(--main-bg);
    font-size: 18px;
    line-height: var(--line-height);
    text-rendering: optimizeLegibility;
    text-align: justify;
    font-feature-settings: "kern" 1;
    font-kerning: normal;
  }

  :root {
    --font-size: 18px;
    --font-h-factor: 1.15;
    --h6-size: calc(var(--font-size) * var(--font-h-factor));
    --h5-size: calc(var(--h6-size) * var(--font-h-factor));
    --h4-size: calc(var(--h5-size) * var(--font-h-factor));
    --h3-size: calc(var(--h4-size) * var(--font-h-factor));
    --h2-size: calc(var(--h3-size) * var(--font-h-factor));
    --h1-size: calc(var(--h2-size) * var(--font-h-factor));
    --title-font-size: 2rem;
    --main-bg: #fffff8;
    --main-text: #111111;
    --heading: #b71c1c;
    --mark: #ffccbc;
    --algorithm-bg: #e3f2fd;
    --algorithm-border: #0d47a1;
    --note-bg: #f1f8e9;
    --note-border: #33691e;
    --abstract-bg: #f3e5f5;
    --abstract-border: #4a148c;
    --example-bg: #eceff1;
    --example-border: #263238;
    --definition-bg: #FBE9E7;
    --definition-border: #BF360C;
    --quote-bg: #fff3e0;
    --quote-border: #e65100;
    --aside-border: #1b5e20;
    --aside-bg: #e8f5e9;
    --objective-bg: var(--definition-bg);
    --objective-border: var(--definition-border);
    --result-bg: var(--example-bg);
    --result-border: var(--example-border);
    --method-bg: var(--algorithm-bg);
    --method-border: var(--algorithm-border);
    --math-bg: var(--algorithm-bg);
    --math-border: var(--algorithm-border);
    --context-bg: #f1f8e9;
    --context-border: #33691e;
    --link: #007acc;
    --code: #ddd;
    --hr: #ddd;
    --radius: 2px;
    --kw-todo: var(--heading);
    --kw-doing: var(--quote-border);
    --kw-waiting: var(--kw-doing);
    --kw-done: var(--aside-border);
    --kw-failed: var(--main-text);
    --line-height: 1.5;
    --annotation: #777;
    --button-over: #fffff0;
    --p-margin-bottom: calc(var(--line-height) * 1em);
    --sep-margin: 4rem;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    scroll-margin-top: 4.5rem;
  }

  p {
    margin-bottom: var(--p-margin-bottom);
  }

a {
    color: var(--link);
    text-decoration: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
	display: table;

	padding-top: 1rem;
	font-size: 1.2rem;
	line-height: 1.2;
	padding-bottom: 0.1em;
	border-bottom: 1px solid currentColor;
	margin-bottom: 1.2rem;

	font-family: "Sans";
	font-weight: normal;
	color: var(--heading);

}
`;
