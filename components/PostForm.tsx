import {
  Stack,
  MultiSelect,
  Button,
  Card,
  Group,
  Textarea,
  SelectItem,
} from '@mantine/core';
import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { UserExclamation, Tag as TagIcon } from 'tabler-icons-react';

type PostFormProps = {
  userList: SelectItem[];
  playerTags: string[];
  setPlayerTags: Dispatch<SetStateAction<string[]>>;
  tagList: SelectItem[];
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
  markdownContent: string;
  setMarkdownContent: (
    value: string | ChangeEvent<any> | null | undefined,
  ) => void;
  handleSave: () => void;
  loading: boolean;
};

export function PostForm({
  userList,
  playerTags,
  setPlayerTags,
  tagList,
  selectedTags,
  setSelectedTags,
  markdownContent,
  setMarkdownContent,
  handleSave,
  loading,
}: PostFormProps) {
  return (
    <>
      <Stack mt="xl">
        <MultiSelect
          data={userList}
          label="Tag players"
          description="Subtweeting is against the rules, call them out directly"
          icon={<UserExclamation />}
          size="md"
          sx={{
            width: '50%',
          }}
          maxSelectedValues={10}
          clearButtonLabel="Clear selection"
          value={playerTags}
          onChange={setPlayerTags}
          clearable
          searchable
        />
        <MultiSelect
          data={tagList}
          label="Categories"
          description="Helps people find your art"
          icon={<TagIcon />}
          size="md"
          sx={{
            width: '50%',
          }}
          maxSelectedValues={10}
          clearButtonLabel="Clear selection"
          value={selectedTags}
          onChange={setSelectedTags}
          required
          clearable
          searchable
        />
        <Textarea
          size="md"
          label="Post Content"
          description="Markdown is enabled"
          minRows={8}
          value={markdownContent}
          onChange={setMarkdownContent}
          sx={{ width: '75%' }}
        />
      </Stack>
      <Card mt="xl" shadow="md" withBorder>
        <Group spacing="sm">
          <Button onClick={handleSave} loading={loading}>
            Post
          </Button>
        </Group>
      </Card>
    </>
  );
}
