import { Badge, HStack } from '@chakra-ui/react';
import { Category, getCategoryInfo } from '../../types';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
}

const colorMap: Record<string, string> = {
  pink: 'pink',
  orange: 'orange',
  teal: 'teal',
};

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const info = getCategoryInfo(category);
  const colorPalette = colorMap[info.color] || 'gray';

  return (
    <Badge
      colorPalette={colorPalette}
      size={size}
      variant="subtle"
    >
      <HStack gap="1">
        <i className={info.icon} style={{ fontSize: '0.7em' }} />
        <span>{info.label}</span>
      </HStack>
    </Badge>
  );
}
