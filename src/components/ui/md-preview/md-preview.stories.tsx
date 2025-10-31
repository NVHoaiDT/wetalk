import { Meta, StoryObj } from '@storybook/react';

import { MDPreview } from './md-preview';

const meta: Meta<typeof MDPreview> = {
  component: MDPreview,
};

export default meta;

type Story = StoryObj<typeof MDPreview>;

const longMarkdown = `
# Sample Markdown

This is a paragraph with some **bold** and *italic* text.

## Lists

- Item 1
- Item 2
- Item 3

## Code

\`\`\`javascript
console.log('Hello World!');
\`\`\`

## Another Section

And here's another paragraph with more content to demonstrate line clamping.
Let's make it long enough to see how it works with multiple lines.

1. Numbered list
2. With multiple items
3. To show the effect
`;

export const Default: Story = {
  args: {
    value: `## Hello World!`,
  },
};

export const WithLineClamping: Story = {
  args: {
    value: longMarkdown,
    maxLines: 2,
  },
};

export const WithoutClamping: Story = {
  args: {
    value: longMarkdown,
  },
};
