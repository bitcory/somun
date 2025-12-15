import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getPopularPosts, getPosts } from '../data/supabaseData';
import { Post, CATEGORIES } from '../types';
import { useColorModeValue } from '../components/ui/color-mode';
import { PostCard } from '../components/Post/PostCard';
import { AdSense } from '../components/Common/AdSense';

export function HomePage() {
  const navigate = useNavigate();
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [hotPosts, setHotPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.700');
  const accentColor = useColorModeValue('red.600', 'red.400');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [popular, all] = await Promise.all([
          getPopularPosts(5),
          getPosts(),
        ]);

        setPopularPosts(popular);
        setRecentPosts(all.slice(0, 20));
        setHotPosts(popular.slice(0, 10));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="7xl" py="4">
        {/* Trending Section - 실시간 베스트 */}
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="md"
          mb="4"
          overflow="hidden"
        >
          <HStack
            px="4"
            py="2"
            bg={headerBg}
            borderBottom="1px solid"
            borderColor={borderColor}
            justify="space-between"
          >
            <HStack gap="2">
              <Text color={accentColor} fontWeight="700" fontSize="sm">
                실시간 베스트
              </Text>
              <i className="bi bi-fire" style={{ color: '#e53e3e' }} />
            </HStack>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => navigate('/category/gossip')}
            >
              더보기 &gt;
            </Button>
          </HStack>

          <HStack
            p="4"
            gap="4"
            overflowX="auto"
            css={{
              '&::-webkit-scrollbar': { height: '4px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: '4px' },
            }}
          >
            {popularPosts.length > 0 ? (
              popularPosts.map((post) => (
                <PostCard key={post.id} post={post} variant="thumbnail" />
              ))
            ) : (
              <Text color="gray.500" fontSize="sm" p="4">
                아직 인기 소문이 없어요
              </Text>
            )}
          </HStack>
        </Box>

        {/* Main Content Grid */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 300px' }} gap="4">
          {/* Left Column - Post List */}
          <GridItem>
            <Box
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="md"
              overflow="hidden"
            >
              {/* Category Tabs */}
              <HStack
                px="2"
                py="1"
                bg={headerBg}
                borderBottom="1px solid"
                borderColor={borderColor}
                gap="0"
              >
                <Box
                  as="button"
                  px="3"
                  py="1.5"
                  fontSize="xs"
                  fontWeight="600"
                  color="white"
                  bg="blue.500"
                  borderRadius="sm"
                >
                  전체
                </Box>
                {CATEGORIES.map((cat) => (
                  <Box
                    key={cat.key}
                    as="button"
                    px="3"
                    py="1.5"
                    fontSize="xs"
                    fontWeight="500"
                    color="gray.600"
                    bg="transparent"
                    borderRadius="sm"
                    transition="all 0.15s"
                    _hover={{ color: 'blue.500' }}
                    onClick={() => navigate(`/category/${cat.key}`)}
                  >
                    {cat.shortLabel}
                  </Box>
                ))}
              </HStack>

              {/* Table Header */}
              <HStack
                py="2"
                px="3"
                borderBottom="1px solid"
                borderColor={borderColor}
                bg={useColorModeValue('gray.50', 'gray.750')}
                gap="4"
              >
                <Text fontSize="xs" color="gray.500" w="50px" textAlign="center">
                  말머리
                </Text>
                <Text fontSize="xs" color="gray.500" flex="1">
                  제목
                </Text>
                <HStack gap="3">
                  <Text fontSize="xs" color="gray.500" w="60px" textAlign="center">
                    글쓴이
                  </Text>
                  <Text fontSize="xs" color="gray.500" w="50px" textAlign="center">
                    날짜
                  </Text>
                  <Text fontSize="xs" color="gray.500" w="40px" textAlign="right">
                    조회
                  </Text>
                  <Text fontSize="xs" color="gray.500" w="30px" textAlign="right">
                    추천
                  </Text>
                </HStack>
              </HStack>

              {/* Post List */}
              <VStack gap="0" align="stretch">
                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <PostCard key={post.id} post={post} variant="list" />
                  ))
                ) : (
                  <Box py="8" textAlign="center">
                    <Text color="gray.500">아직 소문이 없어요</Text>
                  </Box>
                )}
              </VStack>

              {/* More Button */}
              <Box p="4" textAlign="center" borderTop="1px solid" borderColor={borderColor}>
                <Button variant="outline" size="sm" onClick={() => navigate('/category/gossip')}>
                  더 많은 소문 보기
                </Button>
              </Box>
            </Box>
          </GridItem>

          {/* Right Column - Sidebar */}
          <GridItem display={{ base: 'none', lg: 'block' }}>
            <VStack gap="4" align="stretch">
              {/* HOT 소문 */}
              <Box
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="md"
                overflow="hidden"
              >
                <HStack
                  px="4"
                  py="2"
                  bg={headerBg}
                  borderBottom="1px solid"
                  borderColor={borderColor}
                >
                  <Text color={accentColor} fontWeight="700" fontSize="sm">
                    HOT 소문
                  </Text>
                  <i className="bi bi-fire" style={{ color: '#e53e3e', fontSize: '0.8rem' }} />
                </HStack>
                <VStack gap="0" align="stretch" p="2">
                  {hotPosts.slice(0, 5).map((post, index) => (
                    <HStack
                      key={post.id}
                      py="1.5"
                      px="2"
                      cursor="pointer"
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                      borderRadius="sm"
                      onClick={() => navigate(`/post/${post.id}`)}
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="700"
                        color={index < 3 ? accentColor : 'gray.500'}
                        w="20px"
                      >
                        {index + 1}
                      </Text>
                      <Text fontSize="sm" lineClamp={1} flex="1">
                        {post.title}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>

              {/* 카테고리별 소문 */}
              {CATEGORIES.map((cat) => (
                <Box
                  key={cat.key}
                  bg={cardBg}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="md"
                  overflow="hidden"
                >
                  <HStack
                    px="4"
                    py="2"
                    bg={headerBg}
                    borderBottom="1px solid"
                    borderColor={borderColor}
                    justify="space-between"
                  >
                    <HStack gap="2">
                      <i className={cat.icon} style={{ fontSize: '0.9rem' }} />
                      <Text fontWeight="600" fontSize="sm">
                        {cat.shortLabel}
                      </Text>
                    </HStack>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => navigate(`/category/${cat.key}`)}
                    >
                      더보기
                    </Button>
                  </HStack>
                  <VStack gap="0" align="stretch" p="2">
                    {recentPosts
                      .filter((p) => p.category === cat.key)
                      .slice(0, 3)
                      .map((post) => (
                        <PostCard key={post.id} post={post} variant="simple" showCategory={false} />
                      ))}
                  </VStack>
                </Box>
              ))}

              {/* Ad */}
              <Box>
                <Text fontSize="xs" color="gray.500" mb="2" textAlign="center">
                  광고
                </Text>
                <AdSense
                  slot="7217586018"
                  format="vertical"
                  style={{ minHeight: '250px' }}
                />
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
