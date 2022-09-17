import { Container } from '@mantine/core';
import {
  getUser,
  supabaseClient,
  supabaseServerClient,
  User,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { PageHeader, PostForm } from 'components';
import { FilePencil, FilePlus } from 'tabler-icons-react';
import { Profile } from 'types/user';
import { Tag, Content } from 'types/content';
import { useState } from 'react';
import { useInputState } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { renderPageTitle } from 'lib/utils';

export const getServerSideProps = withPageAuth({
  redirectTo: '/login?f=ar',
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);

    const { data: post } = await supabaseServerClient(ctx)
      .from<Content>('content')
      .select('*')
      .match({ id: ctx.query.id })
      .single();

    if (!post) {
      return {
        notFound: true,
      };
    }

    const { data: users } = await supabaseServerClient(ctx)
      .from<Profile>('profile')
      .select('id, nickname')
      .neq('id', user.id);

    const { data: tags } = await supabaseServerClient(ctx)
      .from<Tag>('tags')
      .select('*');

    return { props: { post, users, tags } };
  },
});

type EditPostProps = {
  post: Content;
  users: Pick<Profile, 'id' | 'nickname'>[];
  tags: Tag[];
};

export default function EditPost({ post, users, tags }: EditPostProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([...post.tags]);
  const [playerTags, setPlayerTags] = useState<string[]>([...post.playerTags]);
  const [markdownContent, setMarkdownContent] = useInputState(
    post.markdownContent,
  );

  const handleSave = async () => {
    setLoading(true);
    const isValid = validate();

    if (isValid) {
      const { data } = await supabaseClient
        .from<Content>('content')
        .update({
          markdownContent,
          playerTags,
          tags: selectedTags,
          updatedAt: 'now()',
        })
        .match({ id: post.id })
        .single();

      if (data) {
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
        title="Edit Post"
        description="Not everyone can get it right the first time"
        icon={<FilePencil size={48} />}
        iconColor="violet"
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
