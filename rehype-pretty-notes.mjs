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
             * @returns {void}             */
            function (node, index, parent) {
                if (node.tagName === "h1") {
                    parent.children[index] = {
                        type: "element",
                        tagName: node.tagName,
                        properties: {
                            className: "font-bold text-2xl my-2"
                        },
                        children: node.children
                    }
                }
                if (node.tagName === "h2") {
                    parent.children[index] = {
                        type: "element",
                        tagName: node.tagName,
                        properties: {
                            className: "font-bold text-xl my-1"
                        },
                        children: node.children
                    }
                }
                if (node.tagName === "h3") {
                    parent.children[index] = {
                        type: "element",
                        tagName: node.tagName,
                        properties: {
                            className: "font-bold text-lg my-1"
                        },
                        children: node.children
                    }
                }
                if (node.tagName === "ol") {
                    parent.children[index] = {
                        type: "element",
                        tagName: node.tagName,
                        properties: {
                            className: "list-decimal list-outside"
                        },
                        children: node.children.map((child) => {
                            if (child.tagName !== "li") {
                                return child
                            }
                            child.properties = child.properties || {}
                            child.properties =  {
                                className: "pl-4 ml-8"
                            }
                            return child
                        })
                    }
                }
                if (node.tagName === "ul") {
                    parent.children[index] = {
                        type: "element",
                        tagName: node.tagName,
                        properties: {
                            className: "list-disc list-outside"
                        },
                        children: node.children.map((child) => {
                            if (child.tagName !== "li") {
                                return child
                            }
                            child.properties = child.properties || {}
                            child.properties =  {
                                className: "pl-4 ml-8"
                            }
                            return child
                        })
                    }
                }


            })
    }
}
