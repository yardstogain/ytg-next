import {
  Button,
  Card,
  Container,
  Group,
  MultiSelect,
  Stack,
  Textarea,
} from '@mantine/core';
import {
  supabaseClient,
  supabaseServerClient,
  User,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { PageHeader } from 'components';
import { FilePlus, Tag as TagIcon, UserExclamation } from 'tabler-icons-react';
import { Profile } from 'types/user';
import { Tag, Content } from 'types/content';
import { useState } from 'react';
import { useInputState } from '@mantine/hooks';
import { useRouter } from 'next/router';

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  // TODO: how to parallel in this case
  async getServerSideProps(ctx) {
    const { data: users } = await supabaseServerClient(ctx)
      .from<Profile>('profile')
      .select('id, nickname');

    const { data: tags } = await supabaseServerClient(ctx)
      .from<Tag>('tags')
      .select('*');

    return { props: { users, tags } };
  },
});

type NewPostProps = {
  user: User;
  users: Pick<Profile, 'id' | 'nickname'>[];
  tags: Tag[];
};

export default function NewPost({ user, users, tags }: NewPostProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [playerTags, setPlayerTags] = useState<string[]>([]);
  const [markdownContent, setMarkdownContent] = useInputState('');

  const handleSave = async () => {
    setLoading(true);
    const isValid = validate();

    if (isValid) {
      const { data } = await supabaseClient
        .from<Content>('content')
        .insert([
          { author: user.id, markdownContent, playerTags, tags: selectedTags },
        ]);

      if (data) {
        router.replace(`/posts/${data[0].id}`);
      }
    }
    setLoading(false);
  };

  const validate = () => {
    return true;
  };

  const userList = users.map((user) => ({
    value: user.id,
    label: user.nickname,
  }));

  const tagList = tags.map((tag) => ({
    value: tag.slug,
    label: tag.title,
  }));

  return (
    <Container size="lg">
      <PageHeader
        title="New Post"
        description="Fantasy sports isn't just about winning, you have to hurt people's feelings in the process"
        icon={<FilePlus size={48} />}
        iconColor="pink"
      />
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
    </Container>
  );
}
