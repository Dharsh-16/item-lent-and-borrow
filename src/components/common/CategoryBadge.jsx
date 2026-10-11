import React from 'react';
import { 
  BookOpen, 
  Laptop, 
  Shirt, 
  Watch, 
  Trophy, 
  Coins, 
  Package 
} from 'lucide-react';
import { CATEGORIES } from '../../utils/sampleData';

const iconMap = {
  BookOpen,
  Laptop,
  Shirt,
  Watch,
  Trophy,
  Coins,
  Package
};

export function CategoryBadge({ category = 'Other', size = 'normal' }) {
  const catConfig = CATEGORIES.find(c => c.id === category) || {
    id: category,
    label: category,
    color: '#64748b',
    icon: 'Package'
  };

  const IconComponent = iconMap[catConfig.icon] || Package;

  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: size === 'small' ? '11px' : '12px',
        fontWeight: 500,
        color: catConfig.color,
        backgroundColor: `${catConfig.color}15`,
        padding: size === 'small' ? '2px 7px' : '3px 9px',
        borderRadius: '6px',
        border: `1px solid ${catConfig.color}30`
      }}
    >
      <IconComponent size={size === 'small' ? 12 : 13} />
      <span>{catConfig.label}</span>
    </span>
  );
}
