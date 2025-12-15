import { supabase, DbPost, DbComment } from '../lib/supabase';
import { Post, Comment, Category } from '../types';

// 고유 사용자 ID 생성 (좋아요 중복 방지용)
const getUserId = (): string => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('userId', userId);
  }
  return userId;
};

// DB -> App 타입 변환
const mapDbPostToPost = (dbPost: DbPost): Post => ({
  id: dbPost.id,
  category: dbPost.category as Category,
  nickname: dbPost.nickname,
  password: dbPost.password,
  title: dbPost.title,
  content: dbPost.content,
  images: dbPost.images || [],
  views: dbPost.views,
  likes: dbPost.likes,
  commentCount: dbPost.comment_count,
  createdAt: dbPost.created_at,
});

const mapDbCommentToComment = (dbComment: DbComment): Comment => ({
  id: dbComment.id,
  postId: dbComment.post_id,
  nickname: dbComment.nickname,
  content: dbComment.content,
  createdAt: dbComment.created_at,
});

// ========== Posts ==========

export const getPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return (data || []).map(mapDbPostToPost);
};

export const getPostById = async (id: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  return data ? mapDbPostToPost(data) : null;
};

export const getPostsByCategory = async (category: string): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }

  return (data || []).map(mapDbPostToPost);
};

export const getPopularPosts = async (limit: number = 5): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('likes', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching popular posts:', error);
    return [];
  }

  return (data || []).map(mapDbPostToPost);
};

export const searchPosts = async (query: string): Promise<Post[]> => {
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,nickname.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching posts:', error);
    return [];
  }

  return (data || []).map(mapDbPostToPost);
};

export const addPost = async (post: {
  category: Category;
  nickname: string;
  password: string;
  title: string;
  content: string;
  images?: string[];
}): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      category: post.category,
      nickname: post.nickname || '익명',
      password: post.password,
      title: post.title,
      content: post.content,
      images: post.images || [],
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding post:', error);
    return null;
  }

  return data ? mapDbPostToPost(data) : null;
};

export const updatePost = async (
  id: string,
  updates: Partial<{
    category: Category;
    title: string;
    content: string;
    images: string[];
  }>
): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    return null;
  }

  return data ? mapDbPostToPost(data) : null;
};

export const deletePost = async (id: string, password: string): Promise<boolean> => {
  // 먼저 비밀번호 확인
  const { data: post } = await supabase
    .from('posts')
    .select('password')
    .eq('id', id)
    .single();

  if (!post || post.password !== password) {
    return false;
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    return false;
  }

  return true;
};

export const verifyPassword = async (postId: string, password: string): Promise<boolean> => {
  const { data } = await supabase
    .from('posts')
    .select('password')
    .eq('id', postId)
    .single();

  return data?.password === password;
};

export const incrementViews = async (postId: string): Promise<void> => {
  // 직접 조회 후 +1
  const { data } = await supabase
    .from('posts')
    .select('views')
    .eq('id', postId)
    .single();

  if (data) {
    await supabase
      .from('posts')
      .update({ views: data.views + 1 })
      .eq('id', postId);
  }
};

// ========== Comments ==========

export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return (data || []).map(mapDbCommentToComment);
};

export const addComment = async (comment: {
  postId: string;
  nickname: string;
  content: string;
}): Promise<Comment | null> => {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: comment.postId,
      nickname: comment.nickname || '익명',
      content: comment.content,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding comment:', error);
    return null;
  }

  return data ? mapDbCommentToComment(data) : null;
};

// ========== Likes ==========

export const toggleLike = async (postId: string): Promise<{ liked: boolean; likes: number }> => {
  const userId = getUserId();

  // 이미 좋아요 했는지 확인
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    // 좋아요 취소
    await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);
  } else {
    // 좋아요 추가
    await supabase
      .from('likes')
      .insert({ post_id: postId, user_id: userId });
  }

  // 현재 좋아요 수 조회
  const { data: post } = await supabase
    .from('posts')
    .select('likes')
    .eq('id', postId)
    .single();

  return {
    liked: !existingLike,
    likes: post?.likes || 0,
  };
};

export const isPostLiked = async (postId: string): Promise<boolean> => {
  const userId = getUserId();

  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  return !!data;
};
