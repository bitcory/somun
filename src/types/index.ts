export type Category = 'gossip' | 'rumor' | 'amazing';

export interface Post {
  id: string;
  category: Category;
  nickname: string;
  password: string; // 글 수정/삭제용 비밀번호
  title: string;
  content: string;
  images: string[];
  views: number;
  likes: number;
  createdAt: string;
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  nickname: string;
  content: string;
  createdAt: string;
}

export interface CategoryInfo {
  key: Category;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { key: 'gossip', label: '세상의 가십거리', shortLabel: '가십', icon: 'bi-chat-quote-fill', color: 'pink' },
  { key: 'rumor', label: '카더라통신', shortLabel: '카더라', icon: 'bi-broadcast', color: 'orange' },
  { key: 'amazing', label: '세상에 이런일이', shortLabel: '이런일이', icon: 'bi-emoji-surprise-fill', color: 'teal' },
];

export const getCategoryInfo = (key: Category): CategoryInfo => {
  return CATEGORIES.find((c) => c.key === key) || CATEGORIES[0];
};
