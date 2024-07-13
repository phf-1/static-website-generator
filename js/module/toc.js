/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const toc_id = "table-of-content";

/*
 * Return a new id for each invocation.
 *
 * id_build() : Int
 */
const id_build = (function () {
    let id = 0;
    return () => {
        id = id + 1;
        return id;
    };
})();

/*
 * When section is visible, highlight the heading. Remove the highlight when the
 * section is no longer visible.
 *
 * section, heading : Node
 */
const highlight_toc_heading = function (section, heading) {
    // The CSS class added/removed to the heading depending on section's visibility.
    const highlight = "highlight";

    // If the section is visible according to this threshold, then add highlight to
    // the heading classes or remove it.
    const threshold = 0; // : ∈ [0.0, 1.0]

    // The callback executed whenever the threshold is crossed.
    const callback = function (entries) {
        const entry = entries[0];
        if (entry.isIntersecting) {
            heading.classList.add(highlight);
        } else {
            heading.classList.remove(highlight);
        }
    };

    // when an intersection occurs, execute the callback.
    let options = {
        root: null, // viewport
        rootMargin: "0px",
        threshold: threshold,
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(section); // callback is called now.
};

/*
 * Build a table of content from a list of sections.
 *
 * Heading ≡ h1 | … | h6
 * toc_build : List Heading → Toc
 */
const toc_build = function (sections) {
    const toc = document.createElement("nav");
    toc.id = toc_id;
    const add_heading_to_toc = function (section) {
        const heading = section.shadowRoot.firstElementChild.firstElementChild;
        const toc_heading = heading.cloneNode();
        section.id = section.id === "" ? id_build() : section.id;
        highlight_toc_heading(section, toc_heading);
        const a = document.createElement("a");
        a.href = "#" + section.id;
        a.innerHTML = heading.innerHTML;
        toc_heading.appendChild(a);
        toc.appendChild(toc_heading);
    };
    sections.forEach(add_heading_to_toc);
    return toc;
};

/*
 * Build a table of content from an arbitrary node.
 *
 * element_toc : Node → Toc
 */
const element_toc = function (element) {
    return toc_build(
        Array.from(element.querySelectorAll("x-h2,x-h3,x-h4,x-h5,x-h6")),
    );
};

const Toc = class {
    // Public
    constructor(content) {
        this.#toc = element_toc(content);
    }

    toggle() {
        if (this.#toc.checkVisibility()) {
            this.#toc.style.display = "none";
        } else {
            this.#toc.style.display = "block";
        }
    }

    node() {
        return this.#toc;
    }

    // Private
    #toc;
};

export { Toc };
