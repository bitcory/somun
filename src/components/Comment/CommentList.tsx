import { Box, Text, HStack, VStack, Input, Textarea, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { Comment } from '../../types';
import { CommentItem } from './CommentItem';
import { useColorModeValue } from '../ui/color-mode';

interface CommentListProps {
  comments: Comment[];
  onAddComment: (nickname: string, content: string) => void;
}

export function CommentList({ comments, onAddComment }: CommentListProps) {
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = () => {
    if (!content.trim()) return;
    onAddComment(nickname.trim() || '익명', content.trim());
    setContent('');
  };

  return (
    <Box>
      <HStack gap="2" mb="6">
        <i className="bi bi-chat-dots-fill" style={{ color: '#3182ce', fontSize: '1.2rem' }} />
        <Text fontWeight="600" fontSize="lg">
          댓글 {comments.length}개
        </Text>
      </HStack>

      {/* Comment Input */}
      <Box
        mb="6"
        p="4"
        bg={inputBg}
        borderRadius="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <VStack gap="3" align="stretch">
          <Input
            placeholder="닉네임 (비워두면 '익명')"
            size="sm"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            bg={inputBg}
          />
          <Textarea
            placeholder="댓글을 입력하세요..."
            size="sm"
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            bg={inputBg}
          />
          <Button
            colorPalette="blue"
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim()}
          >
            <i className="bi bi-send-fill" style={{ marginRight: 8 }} />
            댓글 등록
          </Button>
        </VStack>
      </Box>

      {/* Comments List */}
      <VStack gap="0" align="stretch">
        {comments.length === 0 ? (
          <Box py="8" textAlign="center">
            <i className="bi bi-chat" style={{ fontSize: '2rem', color: 'gray', marginBottom: 8, display: 'block' }} />
            <Text color="gray.500" fontSize="sm">
              아직 댓글이 없어요. 첫 댓글을 남겨보세요!
            </Text>
          </Box>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </VStack>
    </Box>
  );
}
