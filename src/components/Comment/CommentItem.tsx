import { Box, Text, HStack } from '@chakra-ui/react';
import { Comment } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { useColorModeValue } from '../ui/color-mode';

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      py="4"
      borderBottom="1px solid"
      borderColor={borderColor}
    >
      <HStack gap="3" mb="2">
        <Text fontSize="sm" fontWeight="600">
          <i className="bi bi-person-circle" style={{ marginRight: 6, color: '#3182ce' }} />
          {comment.nickname}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {formatDate(comment.createdAt)}
        </Text>
      </HStack>
      <Text fontSize="sm" color={useColorModeValue('gray.700', 'gray.400')} whiteSpace="pre-wrap" pl="5">
        {comment.content}
      </Text>
    </Box>
  );
}
