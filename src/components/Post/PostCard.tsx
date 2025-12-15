import { Box, Text, HStack, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { useColorModeValue } from '../ui/color-mode';

interface PostCardProps {
  post: Post;
  variant?: 'list' | 'thumbnail' | 'simple';
  showCategory?: boolean;
}

export function PostCard({ post, variant = 'list', showCategory = true }: PostCardProps) {
  const navigate = useNavigate();
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const categoryColor = useColorModeValue('blue.600', 'blue.300');
  const titleColor = useColorModeValue('gray.900', 'gray.100');
  const metaColor = useColorModeValue('gray.700', 'gray.400');

  const categoryLabels: Record<string, string> = {
    gossip: '가십',
    rumor: '카더라',
    incident: '이런일이',
  };

  // Thumbnail variant - for trending section
  if (variant === 'thumbnail') {
    return (
      <Box
        flex="0 0 auto"
        w="160px"
        cursor="pointer"
        onClick={() => navigate(`/post/${post.id}`)}
        _hover={{ opacity: 0.8 }}
      >
        <Box
          h="90px"
          bg="gray.700"
          borderRadius="sm"
          overflow="hidden"
          mb="2"
        >
          {post.images && post.images.length > 0 ? (
            <Image
              src={post.images[0]}
              alt={post.title}
              w="100%"
              h="100%"
              objectFit="cover"
            />
          ) : (
            <Box
              w="100%"
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={useColorModeValue('gray.200', 'gray.700')}
            >
              <i className="bi bi-megaphone-fill" style={{ fontSize: '1.5rem', color: '#888' }} />
            </Box>
          )}
        </Box>
        <Text fontSize="xs" fontWeight="500" lineClamp={2} color={titleColor}>
          {post.title}
        </Text>
      </Box>
    );
  }

  // Simple variant - minimal list item
  if (variant === 'simple') {
    return (
      <HStack
        py="1.5"
        cursor="pointer"
        _hover={{ bg: hoverBg }}
        px="2"
        borderRadius="sm"
        onClick={() => navigate(`/post/${post.id}`)}
        justify="space-between"
      >
        <HStack gap="2" flex="1" minW="0">
          <Text fontSize="sm" color={titleColor} lineClamp={1} flex="1">
            {post.title}
          </Text>
          {post.commentCount > 0 && (
            <Text fontSize="xs" color="red.500" fontWeight="600">
              [{post.commentCount}]
            </Text>
          )}
        </HStack>
        <Text fontSize="xs" color={metaColor} flexShrink={0}>
          {formatDate(post.createdAt)}
        </Text>
      </HStack>
    );
  }

  // List variant (default) - DCInside style table row
  return (
    <HStack
      py="2"
      px="3"
      borderBottom="1px solid"
      borderColor={borderColor}
      cursor="pointer"
      _hover={{ bg: hoverBg }}
      onClick={() => navigate(`/post/${post.id}`)}
      gap="4"
    >
      {/* Category */}
      {showCategory && (
        <Text
          fontSize="xs"
          color={categoryColor}
          w="50px"
          flexShrink={0}
          textAlign="center"
        >
          {categoryLabels[post.category] || post.category}
        </Text>
      )}

      {/* Title + Comment Count */}
      <HStack flex="1" minW="0" gap="1">
        <Text fontSize="sm" color={titleColor} lineClamp={1}>
          {post.title}
        </Text>
        {post.commentCount > 0 && (
          <Text fontSize="xs" color="red.500" fontWeight="600" flexShrink={0}>
            [{post.commentCount}]
          </Text>
        )}
        {post.images && post.images.length > 0 && (
          <i className="bi bi-image" style={{ fontSize: '0.7rem', color: '#888', flexShrink: 0 }} />
        )}
      </HStack>

      {/* Meta info */}
      <HStack gap="3" flexShrink={0}>
        <Text fontSize="xs" color={metaColor} w="60px" textAlign="center">
          {post.nickname}
        </Text>
        <Text fontSize="xs" color={metaColor} w="50px" textAlign="center">
          {formatDate(post.createdAt)}
        </Text>
        <Text fontSize="xs" color={metaColor} w="40px" textAlign="right">
          {post.views}
        </Text>
        <Text fontSize="xs" color="red.500" w="30px" textAlign="right">
          {post.likes}
        </Text>
      </HStack>
    </HStack>
  );
}
