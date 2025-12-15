import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Button,
  IconButton,
  Image,
  Separator,
  Grid,
  GridItem,
  Spinner,
} from '@chakra-ui/react';
import { Post, Comment } from '../types';
import {
  getPostById,
  getCommentsByPostId,
  addComment,
  incrementViews,
  toggleLike,
  isPostLiked,
  verifyPassword,
  deletePost,
} from '../data/supabaseData';
import { CategoryBadge } from '../components/Common/CategoryBadge';
import { AdSense } from '../components/Common/AdSense';
import { CommentList } from '../components/Comment/CommentList';
import { formatFullDate } from '../utils/formatDate';
import { useColorModeValue } from '../components/ui/color-mode';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
} from '../components/ui/dialog';
import { PasswordInput } from '../components/ui/password-input';

export function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Password modal states
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordAction, setPasswordAction] = useState<'edit' | 'delete'>('edit');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const [foundPost, postComments, postLiked] = await Promise.all([
          getPostById(id),
          getCommentsByPostId(id),
          isPostLiked(id),
        ]);

        if (foundPost) {
          setPost(foundPost);
          setComments(postComments);
          setLiked(postLiked);
          // 조회수 증가
          incrementViews(id);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddComment = async (nickname: string, content: string) => {
    if (!id) return;

    const newComment = await addComment({
      postId: id,
      nickname,
      content,
    });

    if (newComment) {
      setComments((prev) => [newComment, ...prev]);
      if (post) {
        setPost({ ...post, commentCount: post.commentCount + 1 });
      }
    }
  };

  const handleLike = async () => {
    if (!id || !post) return;

    const result = await toggleLike(id);
    setLiked(result.liked);
    setPost({ ...post, likes: result.likes });
  };

  const handleImageClick = (img: string) => {
    setSelectedImage(img);
    setImageModalOpen(true);
  };

  const handleEditClick = () => {
    setPasswordAction('edit');
    setPassword('');
    setPasswordError('');
    setPasswordModalOpen(true);
  };

  const handleDeleteClick = () => {
    setPasswordAction('delete');
    setPassword('');
    setPasswordError('');
    setPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async () => {
    if (!id) return;

    const isValid = await verifyPassword(id, password);
    if (!isValid) {
      setPasswordError('비밀번호가 일치하지 않아요');
      return;
    }

    if (passwordAction === 'edit') {
      setPasswordModalOpen(false);
      navigate(`/edit/${id}`, { state: { password } });
    } else {
      const success = await deletePost(id, password);
      if (success) {
        setPasswordModalOpen(false);
        alert('글이 삭제되었어요');
        navigate('/');
      } else {
        setPasswordError('삭제에 실패했어요');
      }
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack gap="4">
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.500">소문을 불러오는 중...</Text>
        </VStack>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="7xl" py="8">
          <VStack gap="4" py="8">
            <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem', color: 'gray' }} />
            <Text color="gray.500">소문을 찾을 수 없어요</Text>
            <Button variant="ghost" colorPalette="blue" onClick={() => navigate('/')}>
              홈으로 돌아가기
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="7xl" py="6">
        {/* Back button & Category - Full Width */}
        <HStack justify="space-between" mb="4">
          <HStack>
            <IconButton
              variant="ghost"
              size="lg"
              aria-label="Back"
              onClick={() => navigate('/')}
            >
              <i className="bi bi-arrow-left" style={{ fontSize: '1.2rem' }} />
            </IconButton>
            <CategoryBadge category={post.category} size="md" />
          </HStack>

          {/* Edit/Delete buttons */}
          <HStack gap="2">
            <Button
              variant="ghost"
              size="xs"
              onClick={handleEditClick}
            >
              <i className="bi bi-pencil" style={{ marginRight: 4 }} />
              수정
            </Button>
            <Button
              variant="ghost"
              size="xs"
              colorPalette="red"
              onClick={handleDeleteClick}
            >
              <i className="bi bi-trash" style={{ marginRight: 4 }} />
              삭제
            </Button>
          </HStack>
        </HStack>

        {/* Two Column Layout */}
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 400px' }}
          gap="6"
        >
          {/* Left Column - Post Content */}
          <GridItem>
            <Box
              borderRadius="lg"
              p="6"
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              h="fit-content"
            >
              <VStack gap="4" align="stretch">
                <Heading as="h1" size="2xl">
                  {post.title}
                </Heading>

                <HStack justify="space-between" flexWrap="wrap" gap="2">
                  <HStack gap="4">
                    <Text fontSize="sm" color="gray.500">
                      <i className="bi bi-person-fill" style={{ marginRight: 6 }} />
                      {post.nickname}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      <i className="bi bi-clock" style={{ marginRight: 6 }} />
                      {formatFullDate(post.createdAt)}
                    </Text>
                  </HStack>
                  <HStack gap="4">
                    <Text fontSize="sm" color="gray.500">
                      <i className="bi bi-eye-fill" style={{ marginRight: 6 }} />
                      {post.views}
                    </Text>
                  </HStack>
                </HStack>

                <Separator />

                {/* Images - Top */}
                {post.images && post.images.length > 0 && (
                  <VStack gap="3" align="stretch">
                    {post.images.map((img, index) => (
                      <Box
                        key={index}
                        cursor="pointer"
                        borderRadius="md"
                        overflow="hidden"
                        border="1px solid"
                        borderColor={borderColor}
                        bg="gray.900"
                        transition="all 0.2s"
                        _hover={{ borderColor: 'blue.500' }}
                        onClick={() => handleImageClick(img)}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        p="2"
                      >
                        <Image
                          src={img}
                          alt={`image-${index}`}
                          maxW="100%"
                          maxH="500px"
                          objectFit="contain"
                        />
                      </Box>
                    ))}
                  </VStack>
                )}

                {/* Content - Below Images */}
                <Text
                  color={useColorModeValue('gray.800', 'gray.300')}
                  whiteSpace="pre-wrap"
                  lineHeight="1.8"
                  minH="100px"
                  fontSize="md"
                >
                  {post.content}
                </Text>

                <Separator />

                {/* Like & Share */}
                <HStack justify="center" gap="8">
                  <Button
                    variant={liked ? 'solid' : 'ghost'}
                    colorPalette={liked ? 'red' : 'gray'}
                    size="lg"
                    onClick={handleLike}
                  >
                    <i className={liked ? 'bi bi-heart-fill' : 'bi bi-heart'} style={{ marginRight: 8, fontSize: '1.2rem' }} />
                    {post.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('링크가 복사되었어요!');
                    }}
                  >
                    <i className="bi bi-share" style={{ marginRight: 8, fontSize: '1.2rem' }} />
                    공유
                  </Button>
                </HStack>
              </VStack>
            </Box>

            {/* Ad below post content */}
            <Box mt="4">
              <Text fontSize="xs" color="gray.500" mb="2">
                광고
              </Text>
              <AdSense
                slot="7217586018"
                format="auto"
                style={{ minHeight: '250px', width: '100%' }}
              />
            </Box>
          </GridItem>

          {/* Right Column - Comments */}
          <GridItem>
            <Box
              borderRadius="lg"
              p="6"
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              maxH={{ lg: 'calc(100vh - 120px)' }}
              overflowY={{ lg: 'auto' }}
            >
              <CommentList comments={comments} onAddComment={handleAddComment} />
            </Box>
          </GridItem>
        </Grid>
      </Container>

      {/* Image Modal */}
      <DialogRoot open={imageModalOpen} onOpenChange={(e) => setImageModalOpen(e.open)} size="xl">
        <DialogContent bg="transparent" shadow="none">
          <DialogCloseTrigger />
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="enlarged"
              objectFit="contain"
              maxH="80vh"
            />
          )}
        </DialogContent>
      </DialogRoot>

      {/* Password Modal */}
      <DialogRoot open={passwordModalOpen} onOpenChange={(e) => setPasswordModalOpen(e.open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <i
                className={passwordAction === 'edit' ? 'bi bi-pencil' : 'bi bi-trash'}
                style={{ marginRight: 8, color: passwordAction === 'delete' ? '#fa5252' : '#3182ce' }}
              />
              {passwordAction === 'edit' ? '글 수정' : '글 삭제'}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <VStack gap="4" align="stretch">
              <Text fontSize="sm" color="gray.500">
                {passwordAction === 'edit'
                  ? '글을 수정하려면 비밀번호를 입력해주세요'
                  : '정말 삭제하시겠어요? 삭제하려면 비밀번호를 입력해주세요'}
              </Text>
              <PasswordInput
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />
              {passwordError && (
                <Text fontSize="sm" color="red.500">{passwordError}</Text>
              )}
            </VStack>
          </DialogBody>
          <DialogFooter>
            <HStack gap="2">
              <Button variant="ghost" onClick={() => setPasswordModalOpen(false)}>
                취소
              </Button>
              <Button
                colorPalette={passwordAction === 'delete' ? 'red' : 'blue'}
                onClick={handlePasswordSubmit}
                disabled={!password}
              >
                {passwordAction === 'edit' ? '수정하기' : '삭제하기'}
              </Button>
            </HStack>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
