import { Container } from '@mantine/core';
import {
  getUser,
  supabaseClient,
  supabaseServerClient,
  User,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { PageHeader, PostForm } from 'components';
import { FilePlus } from 'tabler-icons-react';
import { Profile } from 'types/user';
import { Tag, Content } from 'types/content';
import { useState } from 'react';
import { useInputState } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { renderPageTitle } from 'lib/utils';

export const getServerSideProps = withPageAuth({
  redirectTo: '/login?f=ar',
  // TODO: how to parallel in this case
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);

    const { data: users } = await supabaseServerClient(ctx)
      .from<Profile>('profile')
      .select('id, nickname')
      .neq('id', user.id);

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
      // Create post
      const { data } = await supabaseClient
        .from<Content>('content')
        .insert([
          { author: user.id, markdownContent, playerTags, tags: selectedTags },
        ])
        .single();

      if (data) {
        // Send tagged players a notification
        await supabaseClient.from('notifications').insert(
          playerTags.map((player) => ({
            recipient: player,
            sender: user.id,
            type: 'call-out',
            contentId: data.id,
            description: "You've been called out!",
          })),
        );
        // Go to new page
        router.replace(`/posts/${data.id}`);
      }
    }
    setLoading(false);
  };

  const validate = () => {
    if (selectedTags.length === 0) {
      return false;
    }
    return true;
  };

  const userList = users
    .map((user) => ({
      value: user.id,
      label: user.nickname,
    }))
    .filter((x) => x.label != null);

  const tagList = tags
    .map((tag) => ({
      value: tag.slug,
      label: tag.title,
    }))
    .filter((x) => x.label != null);

  return (
    <Container size="lg">
      {renderPageTitle('New Post')}
      <PageHeader
        title="New Post"
        description="Fantasy sports isn't just about winning, you have to hurt people's feelings in the process"
        icon={<FilePlus size={48} />}
        iconColor="pink"
      />
      <PostForm
        userList={userList}
        playerTags={playerTags}
        setPlayerTags={setPlayerTags}
        tagList={tagList}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        markdownContent={markdownContent}
        setMarkdownContent={setMarkdownContent}
        handleSave={handleSave}
        loading={loading}
      />
    </Container>
  );
}
