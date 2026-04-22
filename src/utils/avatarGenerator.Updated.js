/**
 * Pro Wrestling Sim v3.0.0 - Avatar Generator with Red Borders
 * Generates dynamic avatars for wrestlers with professional styling
 */

import React from 'react';

// Color palette for different wrestler styles
const WRESTLER_COLORS = {
  Technical: ['#1e40af', '#3b82f6', '#60a5fa'],
  Power: ['#dc2626', '#ef4444', '#f87171'],
  Aerial: ['#7c3aed', '#a78bfa', '#c4b5fd'],
  Showman: ['#f59e0b', '#fbbf24', '#fcd34d'],
  Balanced: ['#10b981', '#34d399', '#6ee7b7']
};

// Generate consistent color based on wrestler name
const getColorForWrestler = (name, style = 'Balanced') => {
  const colors = WRESTLER_COLORS[style] || WRESTLER_COLORS.Balanced;
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Generate initials from name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * WrestlerAvatar Component - Renders avatar with red border
 */
export const WrestlerAvatar = ({ wrestler, size = 64, className = '' }) => {
  const initials = getInitials(wrestler.name);
  const bgColor = getColorForWrestler(wrestler.name, wrestler.style);
  
  return (
    <div
      className={`wrestler-avatar ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '4px',
        border: '3px solid #cc0000',
        background: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.4}px`,
        fontWeight: '700',
        color: '#ffffff',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 0 10px rgba(204, 0, 0, 0.3)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 20px rgba(204, 0, 0, 0.6)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 10px rgba(204, 0, 0, 0.3)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {initials}
    </div>
  );
};

/**
 * PromotionLogo Component - Renders promotion logo with red border
 */
export const PromotionLogo = ({ promotion, size = 128, className = '' }) => {
  const bgGradient = `linear-gradient(135deg, ${getColorForWrestler(promotion.name)} 0%, ${getColorForWrestler(promotion.name + 'x')} 100%)`;
  
  return (
    <div
      className={`promotion-logo ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '4px',
        border: '3px solid #cc0000',
        background: bgGradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.3}px`,
        fontWeight: '700',
        color: '#ffffff',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 0 15px rgba(204, 0, 0, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 25px rgba(204, 0, 0, 0.6)';
        e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 15px rgba(204, 0, 0, 0.3)';
        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
      }}
    >
      <span style={{ textAlign: 'center', padding: '10px' }}>
        {promotion.name.split(' ')[0].slice(0, 3).toUpperCase()}
      </span>
    </div>
  );
};

/**
 * AvatarGrid Component - Renders grid of avatars
 */
export const AvatarGrid = ({ wrestlers, size = 64, columns = 5 }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '15px',
        padding: '20px'
      }}
    >
      {wrestlers.map((wrestler, idx) => (
        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <WrestlerAvatar wrestler={wrestler} size={size} />
          <div
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#ffffff',
              textAlign: 'center',
              maxWidth: `${size}px`,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {wrestler.name}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * TopWorkersPanel Component - Shows top workers with avatars
 */
export const TopWorkersPanel = ({ workers, maxShow = 10 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {workers.slice(0, maxShow).map((worker, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px',
            background: 'rgba(204, 0, 0, 0.05)',
            borderRadius: '3px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(204, 0, 0, 0.15)';
            e.currentTarget.style.transform = 'translateX(5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(204, 0, 0, 0.05)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <WrestlerAvatar wrestler={worker} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>
              {worker.name}
            </div>
            <div style={{ fontSize: '10px', color: '#999999' }}>
              {worker.promotion || 'Independent'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * TopPromotionsPanel Component - Shows top promotions with logos
 */
export const TopPromotionsPanel = ({ promotions, maxShow = 10 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {promotions.slice(0, maxShow).map((promo, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px',
            background: 'rgba(204, 0, 0, 0.05)',
            borderRadius: '3px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(204, 0, 0, 0.15)';
            e.currentTarget.style.transform = 'translateX(5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(204, 0, 0, 0.05)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <PromotionLogo promotion={promo} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>
              {promo.name}
            </div>
            <div style={{ fontSize: '10px', color: '#999999' }}>
              {promo.country || 'International'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default {
  WrestlerAvatar,
  PromotionLogo,
  AvatarGrid,
  TopWorkersPanel,
  TopPromotionsPanel,
  getColorForWrestler,
  getInitials
};
