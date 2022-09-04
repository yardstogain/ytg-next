import { User } from '@supabase/auth-helpers-nextjs';
import { Profile } from './user';

export type Tag = {
  slug: string;
  createdAt: string;
  updatedAt: string;
  author: User['id'];
  description: string;
  title: string;
};

export type Content = {
  id: string;
  createdAt: string;
  updatedAt: string;
  author: User['id'];
  markdownContent: string;
  tags: string[];
  playerTags: string[];
};

export type Comment = {
  id: string;
  createdAt: string;
  updatedAt: string;
  author: User['id'];
  markdownContent: string;
  contentId: string;
};

export type ContentWithComments = Content & {
  comments: Comment[];
};

export type FullContent = ContentWithComments & {
  profile: Profile;
};
