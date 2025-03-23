#!/usr/bin/python3

from io import TextIOWrapper
import argparse


def extract_raw_props(fileobj: TextIOWrapper) -> list[str]:
    """Extracts the raw (unprocessed) frontmatter props from `fileobj`.

    This function assumes the convention that any blog post file will always
    begin with a frontmatter section. Anything before that section will be
    discarded and will not be part of the processed file.
    """

    props = []
    in_props = False

    for line in fileobj:
        stripped = line.strip()
        if "---" == stripped:
            if in_props:
                break
            in_props = True
            continue
        if in_props:
            props.append(stripped)

    return props


def extract_raw_content(fileobj: TextIOWrapper) -> list[str]:
    """Extracts the raw (unprocessed) blog post content from `fileobj`."""
    raw_content = []
    for line in fileobj:
        raw_content.append(line)

    # now remove end-of-file newlines that might remain
    i = len(raw_content) - 1
    while i > 0 and raw_content[i] == "\n":
        raw_content.pop()
        i -= 1
    return raw_content


def parse_props(raw_props: list[str]) -> dict[str, str]:
    """Parses a list of raw (unprocessed) frontmatter props and returns a
    dictionary with clean prop values.
    """

    props = {
        "layout": "../../layouts/PostLayout.astro",
    	"title": None,
    	"description": None,
    	"created_at": None,
    	"last_updated_at": None,
    	"tags": None,
    }

    tags = []
    found_tags = False	
    for line in raw_props:
        if found_tags:
            tags.append(line.replace("- ", "").strip())
        elif ":" in line:
            if "tags" in line:
                found_tags = True
                continue
            key, value = map(str.strip, line.split(":", 1))
            props[key] = value
    props["tags"] = f"[{', '.join(tags)}]"
    return props


def parse_content(raw_content: list[str], max_line_length: int = 80) -> list[str]:
    """Parses the content of the blog post and returns a wrapped version of it."""

    content = []
    found_math_block = False
    found_code_block = False

    for line in raw_content:
        if "$$" in line:
            if found_math_block is False:
                content.append(line.strip())
                found_math_block = True
            else:
                content.append(line.strip())
                found_math_block = False
            continue

        if "```" in line:
            if found_code_block is False:
                content.append(line.strip())
                found_code_block = True
            else:
                content.append(line.strip())
                found_code_block = False
            continue

        if line == "\n" or found_math_block or found_code_block:
            content.append(line.rstrip())
            continue

        split = line_split(line, max_line_length)
        content.extend(split)

    return content


def line_split(line: str, max_len) -> list[str]:
    """Splits a given line into multiple lines if their length exceeds `max_len`."""

    inline_delimiters = {"$", "`", "*", "**"}
    split = []
    i = 0
    while i < len(line):
        chars = []
        within_inline_block = False
        delimeter: str | None = None

        while len(chars) < max_len and i < len(line):
            char = line[i]
            chars.append(char)

            if char in inline_delimiters:
                within_inline_block = not within_inline_block
                delimeter = char if within_inline_block else None

            i += 1

        if i < len(line):
            if within_inline_block:
                assert delimeter is not None
                while chars and chars[-1] != delimeter:
                    chars.pop()
                    i -= 1

                # because we use chars[-1] to check for the delimeter we need
                # to backtrack the opening delimeter
                chars.pop()
                i -= 1
            else:
                while chars and chars[-1] != " ":
                    chars.pop()
                    i -= 1

        split.append("".join(chars).strip())
    return split


def write_formatted(filename: str, props: dict[str, str], content: list[str]) -> None:
    "Writes a formatted version of a blog post to `filename`."

    with open(filename, "w", encoding="utf-8") as file:
        file.write("---\n")
        for key, val in props.items():
            file.write(f"{key}: {val}\n")
        file.write("---\n\n")

        for line in content:
            if line == "\n":
                file.write(line)
            else:
                file.write(f"{line}\n")


def main():
    parser = argparse.ArgumentParser(
        prog="Post Formatter",
        description="A script to process and format blog posts by extracting frontmatter properties and wrapping content for better readability.",
        epilog="Ensure that the input file follows the expected frontmatter format. The processed output will be saved with a 'tmp_' prefix."
    )

    parser.add_argument("-s", "--source", required=True, help="The source file to format")
    parser.add_argument("-o", "--out", required=True, help="The output file to format")
    parser.add_argument("-m", "--max-length", type=int, help="Maximum line length of the output file")

    args = parser.parse_args()
    SOURCE_FILE = args.source
    OUTPUT_FILE = args.out
    MAX_LINE_LENGTH = args.max_length if args.max_length is not None else 80

    with open(SOURCE_FILE, encoding="utf-8") as file:
        raw_props = extract_raw_props(file)
        raw_content = extract_raw_content(file)

    props = parse_props(raw_props)
    content = parse_content(raw_content, MAX_LINE_LENGTH)
    write_formatted(OUTPUT_FILE, props, content)

if __name__ == "__main__":
    main()
