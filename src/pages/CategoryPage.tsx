import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { PostCard } from '../components/Post/PostCard';
import { getPostsByCategory, getPopularPosts } from '../data/supabaseData';
import { Post, getCategoryInfo, Category, CATEGORIES } from '../types';
import { useColorModeValue } from '../components/ui/color-mode';
import { AdSense } from '../components/Common/AdSense';

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [hotPosts, setHotPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryInfo = category ? getCategoryInfo(category as Category) : null;

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.700');
  const accentColor = useColorModeValue('red.600', 'red.400');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoryPosts, popular] = await Promise.all([
          category ? getPostsByCategory(category) : Promise.resolve([]),
          getPopularPosts(5),
        ]);
        setPosts(categoryPosts);
        setHotPosts(popular);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  if (!categoryInfo) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="7xl" py="8">
          <VStack py="8">
            <Text color="gray.500">카테고리를 찾을 수 없습니다</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

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
        <Grid templateColumns={{ base: '1fr', lg: '1fr 300px' }} gap="4">
          {/* Left Column - Posts */}
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
                  fontWeight="500"
                  color="gray.600"
                  bg="transparent"
                  borderRadius="sm"
                  transition="all 0.15s"
                  _hover={{ color: 'blue.500' }}
                  onClick={() => navigate('/')}
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
                    fontWeight={cat.key === category ? '600' : '500'}
                    color={cat.key === category ? 'white' : 'gray.600'}
                    bg={cat.key === category ? 'blue.500' : 'transparent'}
                    borderRadius="sm"
                    transition="all 0.15s"
                    _hover={{ color: cat.key === category ? 'white' : 'blue.500' }}
                    onClick={() => navigate(`/category/${cat.key}`)}
                  >
                    {cat.shortLabel}
                  </Box>
                ))}
              </HStack>

              {/* Category Header */}
              <HStack px="4" py="3" borderBottom="1px solid" borderColor={borderColor}>
                <i className={categoryInfo.icon} style={{ fontSize: '1.2rem' }} />
                <Text fontWeight="700" fontSize="lg">
                  {categoryInfo.label}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  ({posts.length}개)
                </Text>
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

              {/* Posts */}
              {posts.length === 0 ? (
                <Box py="8" textAlign="center">
                  <i className="bi bi-inbox" style={{ fontSize: '2rem', color: '#888' }} />
                  <Text color="gray.500" mt="2" fontSize="sm">
                    아직 이 카테고리에 소문이 없어요
                  </Text>
                </Box>
              ) : (
                <VStack gap="0" align="stretch">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} variant="list" showCategory={false} />
                  ))}
                </VStack>
              )}
            </Box>
          </GridItem>

          {/* Right Column - Sidebar */}
          <GridItem display={{ base: 'none', lg: 'block' }}>
            <VStack gap="4" align="stretch" position="sticky" top="80px">
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
                  {hotPosts.map((post, index) => (
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

              {/* Other Categories */}
              {CATEGORIES.filter((c) => c.key !== category).map((cat) => (
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
                    cursor="pointer"
                    onClick={() => navigate(`/category/${cat.key}`)}
                    _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}
                  >
                    <HStack gap="2">
                      <i className={cat.icon} style={{ fontSize: '0.9rem' }} />
                      <Text fontWeight="600" fontSize="sm">
                        {cat.shortLabel}
                      </Text>
                    </HStack>
                    <i className="bi bi-chevron-right" style={{ fontSize: '0.7rem', color: '#888' }} />
                  </HStack>
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
                  style={{ minHeight: '600px' }}
                />
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
