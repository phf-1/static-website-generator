import { css } from "lit";

export const sharedStyles = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    scroll-margin-top: 4.5rem;
  }

  a {
    color: var(--link);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;
