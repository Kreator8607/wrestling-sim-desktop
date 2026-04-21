/**
 * Avatar Generator System
 * Generates consistent avatars for wrestlers based on their attributes
 */

export const AvatarGenerator = {
  /**
   * Generate avatar SVG for a wrestler
   */
  generateAvatar(wrestler, size = 64) {
    const { name, wrestling, entertainment, starPower, intimidation, sexAppeal } = wrestler;
    
    // Generate consistent colors based on name hash
    const hash = this.hashCode(name);
    const colors = this.getColorScheme(hash);
    
    // Determine avatar style based on attributes
    const style = this.determineStyle(wrestling, entertainment, starPower, intimidation, sexAppeal);
    
    // Generate SVG
    const svg = this.generateSVG(name, colors, style, size);
    
    return svg;
  },

  /**
   * Generate SVG avatar
   */
  generateSVG(name, colors, style, size) {
    const initials = this.getInitials(name);
    const bgColor = colors.primary;
    const textColor = colors.text;
    const accentColor = colors.accent;
    
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="${size}" height="${size}" fill="${bgColor}" rx="8"/>
        
        <!-- Accent decoration based on style -->
        ${this.getStyleDecoration(style, size, accentColor)}
        
        <!-- Initials -->
        <text 
          x="${size / 2}" 
          y="${size / 2 + 2}" 
          font-size="${size * 0.4}" 
          font-weight="bold" 
          fill="${textColor}" 
          text-anchor="middle" 
          dominant-baseline="middle"
          font-family="Arial, sans-serif"
        >
          ${initials}
        </text>
      </svg>
    `;
  },

  /**
   * Get style decoration based on wrestler attributes
   */
  getStyleDecoration(style, size, accentColor) {
    const decorations = {
      technical: `<circle cx="${size * 0.15}" cy="${size * 0.15}" r="${size * 0.08}" fill="${accentColor}" opacity="0.6"/>`,
      power: `<rect x="${size * 0.08}" y="${size * 0.08}" width="${size * 0.16}" height="${size * 0.16}" fill="${accentColor}" opacity="0.6"/>`,
      aerial: `<polygon points="${size * 0.5},${size * 0.08} ${size * 0.92},${size * 0.92} ${size * 0.08},${size * 0.92}" fill="${accentColor}" opacity="0.3"/>`,
      showman: `<circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.35}" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.6"/>`,
      balanced: `<path d="M ${size * 0.2} ${size * 0.5} L ${size * 0.8} ${size * 0.5}" stroke="${accentColor}" stroke-width="2" opacity="0.6"/>`,
    };
    
    return decorations[style] || '';
  },

  /**
   * Determine wrestler style based on attributes
   */
  determineStyle(wrestling, entertainment, starPower, intimidation, sexAppeal) {
    const attributes = {
      wrestling,
      entertainment,
      starPower,
      intimidation,
      sexAppeal,
    };
    
    const max = Math.max(...Object.values(attributes));
    
    for (const [style, value] of Object.entries(attributes)) {
      if (value === max) {
        if (style === 'wrestling') return 'technical';
        if (style === 'intimidation') return 'power';
        if (style === 'starPower') return 'aerial';
        if (style === 'entertainment') return 'showman';
        if (style === 'sexAppeal') return 'balanced';
      }
    }
    
    return 'balanced';
  },

  /**
   * Get color scheme based on hash
   */
  getColorScheme(hash) {
    const schemes = [
      { primary: '#FF6B6B', accent: '#FF8E8E', text: '#FFFFFF' }, // Red
      { primary: '#4ECDC4', accent: '#6FE7D9', text: '#FFFFFF' }, // Teal
      { primary: '#FFE66D', accent: '#FFF099', text: '#333333' }, // Yellow
      { primary: '#95E1D3', accent: '#B8F3E8', text: '#333333' }, // Mint
      { primary: '#F38181', accent: '#F5A5A5', text: '#FFFFFF' }, // Pink
      { primary: '#AA96DA', accent: '#C9B1E8', text: '#FFFFFF' }, // Purple
      { primary: '#FCBAD3', accent: '#FDD0E1', text: '#333333' }, // Light Pink
      { primary: '#A8E6CF', accent: '#C5F0E0', text: '#333333' }, // Green
      { primary: '#FFD3B6', accent: '#FFE5CC', text: '#333333' }, // Peach
      { primary: '#FFAAA5', accent: '#FFC4BF', text: '#FFFFFF' }, // Coral
    ];
    
    const index = Math.abs(hash) % schemes.length;
    return schemes[index];
  },

  /**
   * Hash string to number
   */
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  },

  /**
   * Get initials from name
   */
  getInitials(name) {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  /**
   * Convert SVG to data URL
   */
  svgToDataUrl(svg) {
    const encoded = encodeURIComponent(svg);
    return `data:image/svg+xml,${encoded}`;
  },

  /**
   * Generate avatar URL for wrestler
   */
  getAvatarUrl(wrestler, size = 64) {
    const svg = this.generateAvatar(wrestler, size);
    return this.svgToDataUrl(svg);
  },

  /**
   * Generate avatars for multiple wrestlers
   */
  generateAvatarBatch(wrestlers, size = 64) {
    return wrestlers.map(wrestler => ({
      ...wrestler,
      avatar: this.getAvatarUrl(wrestler, size),
    }));
  },
};

/**
 * Promotion Logo Generator
 */
export const PromotionLogoGenerator = {
  /**
   * Generate logo for promotion
   */
  generateLogo(promotion, size = 128) {
    const { name, country } = promotion;
    
    // Generate consistent colors based on name
    const hash = AvatarGenerator.hashCode(name);
    const colors = this.getPromotionColors(hash);
    
    // Generate logo SVG
    const svg = this.generateLogoSVG(name, colors, size);
    
    return svg;
  },

  /**
   * Generate logo SVG
   */
  generateLogoSVG(name, colors, size) {
    const initials = AvatarGenerator.getInitials(name);
    const bgColor = colors.primary;
    const textColor = colors.text;
    const accentColor = colors.accent;
    
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${accentColor};stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <rect width="${size}" height="${size}" fill="url(#logoGradient)" rx="12"/>
        
        <!-- Border -->
        <rect width="${size}" height="${size}" fill="none" stroke="${textColor}" stroke-width="2" rx="12"/>
        
        <!-- Shield shape -->
        <path d="M ${size * 0.2} ${size * 0.2} L ${size * 0.8} ${size * 0.2} L ${size * 0.8} ${size * 0.6} Q ${size * 0.5} ${size * 0.9} ${size * 0.5} ${size * 0.9} Q ${size * 0.2} ${size * 0.6} ${size * 0.2} ${size * 0.6} Z" 
              fill="none" stroke="${textColor}" stroke-width="1.5" opacity="0.5"/>
        
        <!-- Initials -->
        <text 
          x="${size / 2}" 
          y="${size / 2 + 5}" 
          font-size="${size * 0.35}" 
          font-weight="bold" 
          fill="${textColor}" 
          text-anchor="middle" 
          dominant-baseline="middle"
          font-family="Arial, sans-serif"
        >
          ${initials}
        </text>
      </svg>
    `;
  },

  /**
   * Get promotion color scheme
   */
  getPromotionColors(hash) {
    const schemes = [
      { primary: '#000000', accent: '#FFD700', text: '#FFFFFF' }, // WWE style
      { primary: '#FFC52E', accent: '#000000', text: '#000000' }, // AEW style
      { primary: '#FF0000', accent: '#FFFFFF', text: '#FFFFFF' }, // NJPW style
      { primary: '#003DA5', accent: '#FFD700', text: '#FFFFFF' }, // TNA style
      { primary: '#1A1A1A', accent: '#FF6B35', text: '#FFFFFF' }, // ROH style
      { primary: '#00A86B', accent: '#FFFFFF', text: '#FFFFFF' }, // CMLL style
      { primary: '#8B0000', accent: '#FFD700', text: '#FFFFFF' }, // Classic style
      { primary: '#0047AB', accent: '#FFD700', text: '#FFFFFF' }, // Blue style
      { primary: '#FF1493', accent: '#FFFFFF', text: '#FFFFFF' }, // Pink style
      { primary: '#228B22', accent: '#FFD700', text: '#FFFFFF' }, // Green style
    ];
    
    const index = Math.abs(hash) % schemes.length;
    return schemes[index];
  },

  /**
   * Get logo URL for promotion
   */
  getLogoUrl(promotion, size = 128) {
    const svg = this.generateLogo(promotion, size);
    return AvatarGenerator.svgToDataUrl(svg);
  },

  /**
   * Generate logos for multiple promotions
   */
  generateLogoBatch(promotions, size = 128) {
    return promotions.map(promotion => ({
      ...promotion,
      logo: this.getLogoUrl(promotion, size),
    }));
  },
};

/**
 * React Component for Avatar Display
 */
export function WrestlerAvatar({ wrestler, size = 64, className = '' }) {
  const avatarUrl = AvatarGenerator.getAvatarUrl(wrestler, size);
  
  return (
    <img
      src={avatarUrl}
      alt={wrestler.name}
      width={size}
      height={size}
      className={`rounded-lg ${className}`}
      title={wrestler.name}
    />
  );
}

/**
 * React Component for Promotion Logo Display
 */
export function PromotionLogo({ promotion, size = 128, className = '' }) {
  const logoUrl = PromotionLogoGenerator.getLogoUrl(promotion, size);
  
  return (
    <img
      src={logoUrl}
      alt={promotion.name}
      width={size}
      height={size}
      className={`rounded-lg ${className}`}
      title={promotion.name}
    />
  );
}
