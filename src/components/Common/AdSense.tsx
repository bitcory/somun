import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
}

export function AdSense({ slot, format = 'auto', style }: AdSenseProps) {
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <Box
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      overflow="hidden"
      minH="250px"
      style={style}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          minHeight: '250px',
          ...style,
        }}
        data-ad-client="ca-pub-2764784359698938"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </Box>
  );
}
