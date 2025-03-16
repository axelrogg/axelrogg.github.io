import { visit } from "unist-util-visit"

/**
 * @typedef {import("hast").Root} Root
 * @typedef {import("hast").Element} Element
 * @typedef {import("unist").Parent} Parent
 */

/**
 * A Rehype plugin that enhances code blocks by adding a copy button and styling.
 * This function wraps `<pre>` elements with additional UI elements for better user experience.
 *
 * @returns {(tree: Root) => void} A transformer function that modifies the AST.
 */
export default function rehypePrettyCode() {
    /** @type {Element} */
    const copyIconSvg = {
        type: "element",
        tagName: "svg",
        properties: {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            className: ["copy-button hover:cursor-pointer"],
        },
        children: [
            { type: "element", tagName: "rect", properties: { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }, children: [] },
            { type: "element", tagName: "path", properties: { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }, children: [] },
        ],
    };

    /** @type {Element} */
    const copyButtonTooltip = {
        type: "element",
        tagName: "div",
        properties: {
            className: ["hidden group-hover:block z-40 absolute top-7 bg-violet-800 rounded-lg px-2 py-1"]
        },
        children: [
            {
                type: "element",
                tagName: "p",
                properties: {
                    className: ["text-nowrap"]
                },
                children: [
                    {
                        type: "text",
                        value: "Copy code"
                    }
                ]
            }
        ]
    }
    /** @type {Element} */
    const copyButtonDiv = {
        type: "element",
        tagName: "div",
        properties: {
            className: ["group relative hover:cursor-pointer"]
        },
        children: [
            copyIconSvg,
            copyButtonTooltip,
        ]
    }

    /**
     * @param {Root} tree
     * @return {undefined}
     */
    return function (tree) {
        visit(tree, "element",
            /**
             * @param {import("hast").Element} node - The current node being visited.
             * @param {number | null} index - The position of the node in the parent's children array.
             * @param {import("unist").Parent | null} parent - The parent node.
             * @returns {void}
             */
            function (node, index, parent) {
                if (node.tagName === "pre" && parent && typeof index === "number") {
                    console.log(node)
                    /** @type {Element} */
                    const codeBlockBannerDiv= {
                        type: "element",
                        tagName: "div",
                        properties: {
                            className: ["flex flex-row p-3 bg-[#12161f] rounded-t-lg justify-between"]
                        },
                        children: [
                            {
                                type: "element",
                                tagName: "p",
                                properties: {
                                    className: "text-white"
                                },
                                children: [
                                    {
                                        type: "text",
                                        value: node.properties.dataLanguage,
                                    }
                                ]
                            },
                            copyButtonDiv,
                        ]
                    }

                    /** @type {Element} */
                    const mainCodeDiv = {
                        type: "element",
                        tagName: "div",
                        properties: {
                            className: ["p-3 bg-[#0b0e14] rounded-b-lg"],
                        },
                        children: [node]
                    }

                    // Put the pieces together in wrapper divs
                    parent.children[index] = {
                        type: "element",
                        tagName: "div",
                        properties: {
                            className: "my-3"
                        },
                        children: [
                            {
                                type: "element",
                                tagName: "div",
                                children: [codeBlockBannerDiv, mainCodeDiv],
                            }
                        ],
                       
                    };
                }
            })

    }
}
