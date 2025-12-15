import { Post, Comment } from '../types';

const now = new Date();
const getTimeAgo = (minutes: number) => new Date(now.getTime() - minutes * 60 * 1000).toISOString();

export const mockPosts: Post[] = [
  {
    id: '1',
    category: 'gossip',
    nickname: '연예부기자',
    password: '1234',
    title: '요즘 핫한 그 배우 열애설 진짜일까?',
    content: '최근 여러 목격담이 올라오고 있는데요, 어제 한남동에서 둘이 같이 있는 걸 봤다는 분이 계시더라고요. 근데 소속사에서는 아직 아무 말이 없네요. 여러분은 어떻게 생각하세요?\n\n참고로 저는 그냥 지나가다 들은 건데, 주변에서 다들 아는 사이라고 하더라고요.',
    images: [],
    views: 1523,
    likes: 234,
    createdAt: getTimeAgo(5),
    commentCount: 23,
  },
  {
    id: '2',
    category: 'rumor',
    nickname: '익명',
    password: '1234',
    title: '우리 회사 내년에 대규모 구조조정 한다던데...',
    content: '오늘 회의 때 팀장님이 슬쩍 흘리신 말씀인데, 내년 상반기에 대규모 구조조정이 있을 수도 있다고 하시더라고요. 아직 확정은 아니라는데 분위기가 심상치 않아요.\n\n다른 분들도 비슷한 이야기 들으셨나요?',
    images: [],
    views: 892,
    likes: 156,
    createdAt: getTimeAgo(30),
    commentCount: 45,
  },
  {
    id: '3',
    category: 'amazing',
    nickname: '신기방기',
    password: '1234',
    title: '길에서 주운 복권이 3등에 당첨됐어요',
    content: '진짜 믿기 힘든 일이 일어났어요! 어제 출근길에 바닥에 복권이 떨어져 있길래 그냥 주웠거든요. 그런데 오늘 확인해보니까 3등이에요!!\n\n100만원 당첨됐는데 이거 주인 찾아줘야 하는 건가요? 아니면 제가 가져도 되는 건가요?',
    images: [],
    views: 2341,
    likes: 567,
    createdAt: getTimeAgo(120),
    commentCount: 67,
  },
  {
    id: '4',
    category: 'gossip',
    nickname: '익명',
    password: '1234',
    title: '그 아이돌 그룹 해체한다는 소문 들으셨어요?',
    content: '팬덤에서 난리났는데, 멤버들 사이에 불화가 있다는 이야기가 돌고 있어요. 물론 소속사에서는 부인했지만, 최근 활동 보면 확실히 뭔가 이상하긴 해요.',
    images: [],
    views: 3421,
    likes: 789,
    createdAt: getTimeAgo(180),
    commentCount: 89,
  },
  {
    id: '5',
    category: 'rumor',
    nickname: '동네주민',
    password: '1234',
    title: '우리 동네 재개발 된다는데 사실인가요?',
    content: '오늘 부동산에서 들은 이야기인데, 우리 동네가 재개발 구역으로 지정될 수도 있대요. 근데 아직 공식 발표는 없고 그냥 소문만 무성한 상황이에요.\n\n혹시 비슷한 이야기 들으신 분 계신가요?',
    images: [],
    views: 567,
    likes: 45,
    createdAt: getTimeAgo(240),
    commentCount: 12,
  },
  {
    id: '6',
    category: 'amazing',
    nickname: '운좋은사람',
    password: '1234',
    title: '20년 만에 초등학교 친구를 우연히 만났어요',
    content: '해외여행 갔는데, 거기서 초등학교 때 전학 간 친구를 만났어요! 서로 완전 못 알아보다가 이름표 보고 깜짝 놀랐네요.\n\n세상 진짜 좁다는 게 이런 건가봐요.',
    images: [],
    views: 1234,
    likes: 321,
    createdAt: getTimeAgo(360),
    commentCount: 34,
  },
  {
    id: '7',
    category: 'gossip',
    nickname: '찐팬',
    password: '1234',
    title: '대세 배우 성격 실제로 어떤지 아시는 분?',
    content: '요즘 드라마에서 핫한 그 배우요. 실제 성격이 어떤지 궁금해서요. 현장에서 일하시는 분들 계시면 알려주세요!',
    images: [],
    views: 4521,
    likes: 892,
    createdAt: getTimeAgo(60),
    commentCount: 156,
  },
  {
    id: '8',
    category: 'amazing',
    nickname: '믿기힘든',
    password: '1234',
    title: '어제 퇴근길에 유령을 봤어요',
    content: '진짜 소름돋는 경험을 했어요. 어제 야근하고 늦게 퇴근하는데, 회사 복도에서 하얀 그림자가 지나가더라고요. 처음엔 동료인 줄 알았는데 아무도 없었어요...',
    images: [],
    views: 5678,
    likes: 1234,
    createdAt: getTimeAgo(90),
    commentCount: 203,
  },
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    postId: '1',
    nickname: '궁금이',
    content: '오 진짜요? 저도 그 소문 들었어요!',
    createdAt: getTimeAgo(3),
  },
  {
    id: 'c2',
    postId: '1',
    nickname: '익명',
    content: '근데 그거 예전부터 돌던 소문 아닌가요?',
    createdAt: getTimeAgo(10),
  },
  {
    id: 'c3',
    postId: '1',
    nickname: '지나가던',
    content: '저도 비슷한 이야기 들었는데, 사실인지는 모르겠어요',
    createdAt: getTimeAgo(15),
  },
  {
    id: 'c4',
    postId: '3',
    nickname: '법률전문가',
    content: '유실물은 원칙적으로 경찰에 신고해야 해요. 근데 현실적으로...',
    createdAt: getTimeAgo(100),
  },
  {
    id: 'c5',
    postId: '3',
    nickname: '익명',
    content: '와 대박! 축하드려요!',
    createdAt: getTimeAgo(110),
  },
];

// Local storage helpers for mock backend
const POSTS_KEY = 'rumor_plaza_posts_v4';
const COMMENTS_KEY = 'rumor_plaza_comments_v4';
const LIKED_KEY = 'rumor_plaza_liked';

export const initializeMockData = () => {
  if (!localStorage.getItem(POSTS_KEY)) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(mockPosts));
  }
  if (!localStorage.getItem(COMMENTS_KEY)) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(mockComments));
  }
  if (!localStorage.getItem(LIKED_KEY)) {
    localStorage.setItem(LIKED_KEY, JSON.stringify([]));
  }
};

export const getPosts = (): Post[] => {
  const data = localStorage.getItem(POSTS_KEY);
  return data ? JSON.parse(data) : mockPosts;
};

export const getPostById = (id: string): Post | undefined => {
  const posts = getPosts();
  return posts.find((p) => p.id === id);
};

export const getPopularPosts = (limit: number = 5): Post[] => {
  const posts = getPosts();
  return [...posts]
    .sort((a, b) => (b.likes + b.views) - (a.likes + a.views))
    .slice(0, limit);
};

export const getRecentPosts = (limit: number = 10): Post[] => {
  const posts = getPosts();
  return [...posts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getPostsByCategory = (category: string): Post[] => {
  const posts = getPosts();
  if (category === 'all') return posts;
  return posts.filter((p) => p.category === category);
};

export const addPost = (post: Omit<Post, 'id' | 'views' | 'likes' | 'createdAt' | 'commentCount'>): Post => {
  const posts = getPosts();
  const newPost: Post = {
    ...post,
    id: Date.now().toString(),
    views: 0,
    likes: 0,
    createdAt: new Date().toISOString(),
    commentCount: 0,
  };
  posts.unshift(newPost);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return newPost;
};

export const verifyPassword = (id: string, password: string): boolean => {
  const post = getPostById(id);
  return post ? post.password === password : false;
};

export const updatePost = (
  id: string,
  password: string,
  updates: Partial<Pick<Post, 'category' | 'nickname' | 'title' | 'content' | 'images'>>
): Post | null => {
  if (!verifyPassword(id, password)) return null;

  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  posts[index] = { ...posts[index], ...updates };
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return posts[index];
};

export const deletePost = (id: string, password: string): boolean => {
  if (!verifyPassword(id, password)) return false;

  const posts = getPosts();
  const filteredPosts = posts.filter((p) => p.id !== id);
  localStorage.setItem(POSTS_KEY, JSON.stringify(filteredPosts));

  // Also delete related comments
  const comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
  const filteredComments = comments.filter((c: Comment) => c.postId !== id);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(filteredComments));

  return true;
};

export const incrementViews = (id: string): void => {
  const posts = getPosts();
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.views += 1;
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }
};

export const toggleLike = (id: string): { liked: boolean; likes: number } => {
  const posts = getPosts();
  const post = posts.find((p) => p.id === id);
  const likedPosts: string[] = JSON.parse(localStorage.getItem(LIKED_KEY) || '[]');

  if (!post) return { liked: false, likes: 0 };

  const isLiked = likedPosts.includes(id);

  if (isLiked) {
    post.likes -= 1;
    const newLiked = likedPosts.filter((pid) => pid !== id);
    localStorage.setItem(LIKED_KEY, JSON.stringify(newLiked));
  } else {
    post.likes += 1;
    likedPosts.push(id);
    localStorage.setItem(LIKED_KEY, JSON.stringify(likedPosts));
  }

  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return { liked: !isLiked, likes: post.likes };
};

export const isPostLiked = (id: string): boolean => {
  const likedPosts: string[] = JSON.parse(localStorage.getItem(LIKED_KEY) || '[]');
  return likedPosts.includes(id);
};

export const getCommentsByPostId = (postId: string): Comment[] => {
  const data = localStorage.getItem(COMMENTS_KEY);
  const comments: Comment[] = data ? JSON.parse(data) : mockComments;
  return comments
    .filter((c) => c.postId === postId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>): Comment => {
  const data = localStorage.getItem(COMMENTS_KEY);
  const comments: Comment[] = data ? JSON.parse(data) : mockComments;
  const newComment: Comment = {
    ...comment,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  comments.unshift(newComment);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));

  // Update comment count
  const posts = getPosts();
  const post = posts.find((p) => p.id === comment.postId);
  if (post) {
    post.commentCount += 1;
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

  return newComment;
};

export const searchPosts = (query: string): Post[] => {
  if (!query.trim()) return [];
  const posts = getPosts();
  const lowerQuery = query.toLowerCase();
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.content.toLowerCase().includes(lowerQuery) ||
      p.nickname.toLowerCase().includes(lowerQuery)
  );
};
