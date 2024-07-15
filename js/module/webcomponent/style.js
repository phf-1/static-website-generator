import { css } from "lit";

export const sharedStyles = css`
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    scroll-margin-top: 4.5rem;
}

pre {
  overflow-x: auto;
}

a {
    color: var(--x-link-color, blue);
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.button {
    font-family: "Mono" !important;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
    text-transform: uppercase;
    border: 1px solid var(--x-button-border, grey);
    padding: 1em;
    color: var(--x-button-color, black);
    font-weight: lighter;
    font-family: "Sans";
    background-color: inherit;
    border-radius: 2px;
    font-size: 0.8rem;
    transition-duration: 0.1s;
}

.button:hover {
    background-color: var(--x-button-bg-color-hover, grey);
    text-decoration: none;
    box-shadow: var(--x-button-box-shadow, grey);
    transition-duration: 0.1s;
}
`;
