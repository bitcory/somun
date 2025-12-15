import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../../types';
import { useColorModeValue, ColorModeButton } from '../ui/color-mode';
import { LuSearch } from 'react-icons/lu';
import { searchPosts } from '../../data/supabaseData';
import { Post } from '../../types';
import {
  DrawerRoot,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseTrigger,
} from '../ui/drawer';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const headerBg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBg = useColorModeValue('gray.100', 'gray.800');

  const isActive = (path: string) => location.pathname === path;
  const isCategoryActive = (key: string) => location.pathname === `/category/${key}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        const results = await searchPosts(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchResultClick = (postId: string) => {
    navigate(`/post/${postId}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <Box
      as="header"
      bg={headerBg}
      position="sticky"
      top="0"
      zIndex="100"
    >
      {/* Main Header */}
      <Box borderBottom="1px solid" borderColor={borderColor}>
        <Container maxW="7xl" py="2">
          <HStack justify="space-between">
            {/* Logo */}
            <Box cursor="pointer" onClick={() => navigate('/')}>
              <HStack gap="2">
                <i className="bi bi-megaphone-fill" style={{ fontSize: '1.2rem', color: '#3182ce' }} />
                <Text
                  fontSize="lg"
                  fontWeight="800"
                  color={useColorModeValue('gray.800', 'white')}
                  letterSpacing="-0.5px"
                >
                  소문의 광장
                </Text>
              </HStack>
            </Box>

            {/* Search */}
            <Box position="relative" ref={searchRef} flex="1" maxW="400px" mx="4">
              <HStack
                bg={inputBg}
                borderRadius="sm"
                px="3"
                h="32px"
                border="1px solid"
                borderColor={borderColor}
                _focusWithin={{ borderColor: 'blue.500' }}
                transition="all 0.2s"
              >
                <Input
                  placeholder="검색어를 입력하세요"
                  size="xs"
                  border="none"
                  bg="transparent"
                  _focus={{ outline: 'none', boxShadow: 'none' }}
                  _placeholder={{ color: 'gray.500', fontSize: 'sm' }}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                />
                <LuSearch style={{ color: '#888', fontSize: '0.9rem' }} />
              </HStack>

              {/* Search Results Dropdown */}
              {searchOpen && searchResults.length > 0 && (
                <Box
                  position="absolute"
                  top="100%"
                  left="0"
                  right="0"
                  mt="2"
                  bg={headerBg}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="sm"
                  boxShadow="lg"
                  maxH="300px"
                  overflowY="auto"
                  zIndex="200"
                >
                  {searchResults.slice(0, 5).map((post) => (
                    <Box
                      key={post.id}
                      p="3"
                      cursor="pointer"
                      _hover={{ bg: inputBg }}
                      borderBottom="1px solid"
                      borderColor={borderColor}
                      onClick={() => handleSearchResultClick(post.id)}
                    >
                      <Text fontSize="sm" fontWeight="500" lineClamp={1}>
                        {post.title}
                      </Text>
                      <Text fontSize="xs" color="gray.500" lineClamp={1}>
                        {post.content.substring(0, 50)}...
                      </Text>
                    </Box>
                  ))}
                  {searchResults.length > 5 && (
                    <Box p="2" textAlign="center">
                      <Text fontSize="xs" color="gray.500">
                        외 {searchResults.length - 5}개 더 있음
                      </Text>
                    </Box>
                  )}
                </Box>
              )}

              {searchOpen && searchQuery && searchResults.length === 0 && (
                <Box
                  position="absolute"
                  top="100%"
                  left="0"
                  right="0"
                  mt="2"
                  bg={headerBg}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="sm"
                  p="4"
                  textAlign="center"
                  zIndex="200"
                >
                  <Text fontSize="sm" color="gray.500">
                    검색 결과가 없어요
                  </Text>
                </Box>
              )}
            </Box>

            {/* Actions */}
            <HStack gap="2">
              <ColorModeButton />

              <Button
                colorPalette="blue"
                size="sm"
                onClick={() => navigate('/write')}
                display={{ base: 'none', md: 'flex' }}
              >
                <i className="bi bi-pencil-fill" style={{ marginRight: 6 }} />
                글쓰기
              </Button>

              {/* Mobile Menu Button */}
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="Menu"
                display={{ base: 'flex', md: 'none' }}
                onClick={() => setDrawerOpen(true)}
              >
                <i className="bi bi-list" style={{ fontSize: '1.2rem' }} />
              </IconButton>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Category Navigation - DCInside Style */}
      <Box bg="#3b4890" display={{ base: 'none', md: 'block' }}>
        <Container maxW="7xl">
          <HStack gap="0" h="38px">
            <Box
              as="button"
              px="5"
              h="100%"
              fontSize="sm"
              fontWeight="500"
              color="white"
              bg={isActive('/') ? 'rgba(255,255,255,0.15)' : 'transparent'}
              transition="all 0.15s"
              _hover={{ bg: 'rgba(255,255,255,0.1)' }}
              onClick={() => navigate('/')}
              display="flex"
              alignItems="center"
            >
              전체
            </Box>
            {CATEGORIES.map((cat) => (
              <Box
                key={cat.key}
                as="button"
                px="5"
                h="100%"
                fontSize="sm"
                fontWeight="500"
                color="white"
                bg={isCategoryActive(cat.key) ? 'rgba(255,255,255,0.15)' : 'transparent'}
                transition="all 0.15s"
                _hover={{ bg: 'rgba(255,255,255,0.1)' }}
                onClick={() => navigate(`/category/${cat.key}`)}
                display="flex"
                alignItems="center"
                gap="1.5"
              >
                <i className={cat.icon} style={{ fontSize: '0.85rem' }} />
                {cat.shortLabel}
              </Box>
            ))}
            <Box
              as="button"
              px="3"
              h="100%"
              fontSize="sm"
              color="white"
              bg="transparent"
              transition="all 0.15s"
              _hover={{ bg: 'rgba(255,255,255,0.1)' }}
              display="flex"
              alignItems="center"
            >
              <i className="bi bi-caret-down-fill" style={{ fontSize: '0.7rem' }} />
            </Box>
          </HStack>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <DrawerRoot open={drawerOpen} onOpenChange={(e) => setDrawerOpen(e.open)} placement="end">
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <Text fontWeight="700" color="blue.500">
              <i className="bi bi-megaphone-fill" style={{ marginRight: 8 }} />
              소문의 광장
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <VStack gap="2" align="stretch">
              <Button
                variant={isActive('/') ? 'solid' : 'ghost'}
                colorPalette={isActive('/') ? 'blue' : 'gray'}
                justifyContent="flex-start"
                onClick={() => {
                  navigate('/');
                  setDrawerOpen(false);
                }}
              >
                <i className="bi bi-house" style={{ marginRight: 8 }} />
                전체
              </Button>
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.key}
                  variant={isCategoryActive(cat.key) ? 'solid' : 'ghost'}
                  colorPalette={isCategoryActive(cat.key) ? 'blue' : 'gray'}
                  justifyContent="flex-start"
                  onClick={() => {
                    navigate(`/category/${cat.key}`);
                    setDrawerOpen(false);
                  }}
                >
                  <i className={cat.icon} style={{ marginRight: 8 }} />
                  {cat.shortLabel}
                </Button>
              ))}
              <Button
                colorPalette="blue"
                mt="4"
                onClick={() => {
                  navigate('/write');
                  setDrawerOpen(false);
                }}
              >
                <i className="bi bi-pencil-fill" style={{ marginRight: 8 }} />
                글쓰기
              </Button>
            </VStack>
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </Box>
  );
}
