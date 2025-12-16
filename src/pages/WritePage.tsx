import { useRef, useState, useCallback } from 'react';
import {
  Container,
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Input,
  Textarea,
  Button,
  IconButton,
  SimpleGrid,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, Category } from '../types';
import { addPost } from '../data/supabaseData';
import { uploadImage } from '../lib/imageUtils';
import { useColorModeValue } from '../components/ui/color-mode';
import { Field } from '../components/ui/field';
import { NativeSelectRoot, NativeSelectField } from '../components/ui/native-select';
import { PasswordInput } from '../components/ui/password-input';
import { ProgressRoot, ProgressBar } from '../components/ui/progress';

interface FormValues {
  category: Category;
  nickname: string;
  password: string;
  title: string;
  content: string;
}

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function WritePage() {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    category: 'gossip',
    nickname: '',
    password: '',
    title: '',
    content: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBg = useColorModeValue('gray.50', 'gray.700');

  // 공통 이미지 업로드 처리 함수
  const processImageFiles = useCallback(async (files: File[]) => {
    if (images.length >= MAX_IMAGES) {
      alert(`이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있어요`);
      return;
    }

    setUploading(true);

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있어요');
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert('파일 크기는 5MB 이하여야 해요');
        return false;
      }
      return true;
    });

    const remainingSlots = MAX_IMAGES - images.length;
    const filesToProcess = validFiles.slice(0, remainingSlots);

    const newImages: string[] = [];

    for (const file of filesToProcess) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        newImages.push(imageUrl);
      }
    }

    setImages((prev) => [...prev, ...newImages]);
    setUploading(false);
  }, [images.length]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    await processImageFiles(Array.from(files));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 이미지 붙여넣기 처리
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          imageFiles.push(file);
        }
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault();
      await processImageFiles(imageFiles);
    }
  }, [processImageFiles]);

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormValues, string>> = {};

    if (formValues.password.trim().length < 4) {
      newErrors.password = '비밀번호는 4자 이상 입력해주세요';
    }
    if (formValues.title.trim().length < 2) {
      newErrors.title = '제목을 2자 이상 입력해주세요';
    }
    if (formValues.content.trim().length < 10) {
      newErrors.content = '내용을 10자 이상 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const post = await addPost({
      category: formValues.category,
      nickname: formValues.nickname.trim() || '익명',
      password: formValues.password.trim(),
      title: formValues.title.trim(),
      content: formValues.content.trim(),
      images: images,
    });

    if (post) {
      navigate(`/post/${post.id}`);
    } else {
      alert('글 작성에 실패했어요. 다시 시도해주세요.');
    }
  };

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.key,
    label: c.label,
  }));

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="xl" py="8">
        <HStack mb="6">
          <IconButton
            variant="ghost"
            size="lg"
            aria-label="Back"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left" style={{ fontSize: '1.2rem' }} />
          </IconButton>
          <Heading as="h2" size="lg">
            <i className="bi bi-pencil-fill" style={{ marginRight: 12, color: '#3182ce' }} />
            새 소문 작성
          </Heading>
        </HStack>

        <Box
          borderRadius="lg"
          p="6"
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
        >
          <form onSubmit={handleSubmit}>
            <VStack gap="5" align="stretch">
              <Field label="카테고리">
                <NativeSelectRoot>
                  <NativeSelectField
                    value={formValues.category}
                    onChange={(e) => setFormValues({ ...formValues, category: e.target.value as Category })}
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </NativeSelectField>
                </NativeSelectRoot>
              </Field>

              <Field label="닉네임">
                <Input
                  placeholder="비워두면 '익명'으로 표시돼요"
                  value={formValues.nickname}
                  onChange={(e) => setFormValues({ ...formValues, nickname: e.target.value })}
                  bg={inputBg}
                />
              </Field>

              <Field label="비밀번호" required invalid={!!errors.password} errorText={errors.password}>
                <PasswordInput
                  placeholder="글 수정/삭제 시 필요해요 (4자 이상)"
                  value={formValues.password}
                  onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
                />
              </Field>

              <Field label="제목" required invalid={!!errors.title} errorText={errors.title}>
                <Input
                  placeholder="소문의 제목을 입력하세요"
                  value={formValues.title}
                  onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                  bg={inputBg}
                />
              </Field>

              <Field label="내용" required invalid={!!errors.content} errorText={errors.content}>
                <Textarea
                  placeholder="소문의 내용을 자세히 적어주세요... (이미지를 Ctrl+V로 붙여넣을 수 있어요)"
                  rows={10}
                  value={formValues.content}
                  onChange={(e) => setFormValues({ ...formValues, content: e.target.value })}
                  onPaste={handlePaste}
                  bg={inputBg}
                />
              </Field>

              {/* Image Upload Section */}
              <Box>
                <Text fontSize="sm" fontWeight="500" mb="2">
                  이미지 첨부
                  <Text as="span" color="gray.500" fontSize="xs" ml="2">
                    (최대 {MAX_IMAGES}장, 각 5MB 이하)
                  </Text>
                </Text>

                {/* Image Preview Grid */}
                {images.length > 0 && (
                  <SimpleGrid columns={{ base: 2, sm: 3 }} gap="3" mb="3">
                    {images.map((img, index) => (
                      <Box
                        key={index}
                        position="relative"
                        borderRadius="md"
                        overflow="hidden"
                        border="1px solid"
                        borderColor={borderColor}
                      >
                        <Image
                          src={img}
                          alt={`uploaded-${index}`}
                          h="120px"
                          w="100%"
                          objectFit="cover"
                        />
                        <IconButton
                          size="xs"
                          colorPalette="red"
                          position="absolute"
                          top="1"
                          right="1"
                          aria-label="Remove image"
                          onClick={() => removeImage(index)}
                        >
                          <i className="bi bi-x" />
                        </IconButton>
                      </Box>
                    ))}
                  </SimpleGrid>
                )}

                {/* Upload Button */}
                {images.length < MAX_IMAGES && (
                  <Box>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                    <Button
                      variant="outline"
                      w="100%"
                      h="100px"
                      borderStyle="dashed"
                      onClick={() => fileInputRef.current?.click()}
                      loading={uploading}
                    >
                      <VStack gap="1">
                        <i className="bi bi-image" />
                        <Text fontSize="sm">클릭하여 이미지 선택</Text>
                        <Text fontSize="xs" color="gray.500">
                          또는 내용란에서 Ctrl+V로 붙여넣기
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {images.length}/{MAX_IMAGES}장 업로드됨
                        </Text>
                      </VStack>
                    </Button>
                  </Box>
                )}

                {uploading && (
                  <ProgressRoot value={100} mt="2">
                    <ProgressBar />
                  </ProgressRoot>
                )}
              </Box>

              <Button
                type="submit"
                colorPalette="blue"
                size="lg"
                mt="4"
              >
                <i className="bi bi-send-fill" style={{ marginRight: 8 }} />
                소문 퍼뜨리기
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
}
