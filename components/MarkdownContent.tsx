import { Box, List, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';

type MarkdownContentProps = {
  content: string;
};

function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <Box>
      <ReactMarkdown
        children={content}
        components={{
          p({ children }) {
            return (
              <Text size="md" mt="sm">
                {children}
              </Text>
            );
          },
          h2({ children }) {
            return (
              <Text size="lg" weight="bold" mt="md" color="gray.1">
                {children}
              </Text>
            );
          },
          h3({ children }) {
            return (
              <Text size="md" weight="bold" mt="md" color="gray.1">
                {children}
              </Text>
            );
          },
          ul({ children }) {
            return (
              <List withPadding mt="md">
                {children}
              </List>
            );
          },
          li({ children }) {
            return <List.Item>{children}</List.Item>;
          },
        }}
      />
    </Box>
  );
}

export { MarkdownContent };
