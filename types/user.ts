export type Profile = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  nickname: string;
  teamName: string;
  role: number;
  slug: string;
  deleted: boolean;
};

export type Notification = {
  id: number;
  createdAt: string;
  readAt?: string;
  recipient: Profile['id'];
  sender: Profile['id'];
  type: 'call-out' | 'reminder';
  description: string;
  contentId?: string;
};
