import unittest
from post_formatter import extract_raw_post_content, parse_props

class TestPostFormatter(unittest.TestCase):

    def setUp(self):
        self.raw_blog_post = """---

title: "The Future of AI in Software Development"
description: "Exploring how AI is transforming the software engineering landscape."
created_at: "2025-03-24"
last_updated_at: "2025-03-24"
tags:
  - AI
  - Software Development
  - Machine Learning
---

Artificial Intelligence (AI) is rapidly reshaping the software development industry. From automated code generation to intelligent debugging, AI-powered tools are making developers more productive than ever.

## AI-Powered Code Generation

One of the most exciting applications of AI in software development is code generation. Tools like OpenAI Codex and GitHub Copilot assist developers by suggesting entire functions and even generating boilerplate code.

```python
def hello_world():
    print("Hello, World!")
```

These tools help developers by reducing repetitive tasks and improving efficiency. *Imagine* a future where **AI can write entire applications** with minimal human input!

## The Future of AI in Debugging

AI-driven debugging tools can analyze logs, detect patterns, and even suggest fixes for common issues. These advancements significantly reduce the time spent on debugging and improve software reliability.

> *"Debugging is twice as hard as writing the code in the first place."* – Brian Kernighan

$$
E = mc^2
$$

With continuous improvements in AI, software engineering is poised for a **revolutionary transformation**. What do you think the future holds?




"""

    def test_extract_raw_post_content(self):
        props, body = extract_raw_post_content(self.raw_blog_post)

        # props assertions
        self.assertGreater(len(props), 0)
        self.assertEqual(props[0], "title: Some blog post title")
        self.assertEqual(props[1], "description: This is a blog post description")
        self.assertEqual(props[2], "created_at: 2024-07-27")
        self.assertEqual(props[3], "last_updated_at: 2024-12-28")
        self.assertEqual(props[4], "tags:")
        self.assertEqual(props[5], "- tag1")
        self.assertEqual(props[6], "-  tag2")
        self.assertEqual(props[7], "-   tag3")

        # body assertions
        # the number of lines in body should be from '# My Personal Motivation' to the last line of text.
        # Empty lines at the bottom of the file are ignored.
        self.assertEqual(len(body), 8)
        

    def test_parse_props(self):

        raw_props, _ = extract_raw_post_content(self.raw_blog_post)
        parsed_props = parse_props(raw_props)
        self.assertEqual(parsed_props.title, "Some blog post title")
        self.assertEqual(parsed_props.description, "This is a blog post description")
        self.assertEqual(parsed_props.created_at, "2024-07-27")
        self.assertEqual(parsed_props.last_updated_at, "2024-12-28")
        self.assertEqual(parsed_props.tags, "[tag1, tag2, tag3]")

    def test_parse_content(self):
        pass

if __name__ == "__main__":
    unittest.main()
