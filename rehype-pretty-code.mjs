/**
 * @import {Root} from "hast"
 */

import { visit } from "unist-util-visit"

/**
 */
export default function rehypePrettyCode() {
    /**
     * @param {Root} tree
     * @return {undefined}
     */
    return function (tree) {
        visit(tree, "element",
            /**
             * Visitor function to wrap <pre> in a <div>.
             * @param {import("hast").Element} node - The current node being visited.
             * @param {number | null} index - The position of the node in the parent's children array.
             * @param {import("unist").Parent | null} parent - The parent node.
             * @returns {void}
             */
            function (node, index, parent) {
                if (node.tagName === "pre" && parent && typeof index === "number") {
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
                            className: ["copy-button hover:bg-yellow hover:cursor-pointer"],
                        },
                    children: [
                        { type: "element", tagName: "rect", properties: { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }, children: [] },
                        { type: "element", tagName: "path", properties: { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }, children: [] },
                    ],
                };

                    /** import("hast").Element */
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
                            copyIconSvg,
                        ]
                    }

                    /** import("hast").Element */
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
