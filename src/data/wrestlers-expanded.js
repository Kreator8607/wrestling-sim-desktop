/**
 * Expanded Wrestler Database
 * Contains 5000+ wrestlers with realistic attributes
 * Generated with diverse promotions and styles
 */

export const expandedWrestlers = [
  // WWE Superstars (500+)
  { id: 1, name: 'Roman Reigns', promotion: 'WWE', wrestling: 92, entertainment: 88, starPower: 98, intimidation: 95, sexAppeal: 85, height: 190, weight: 120 },
  { id: 2, name: 'The Rock', promotion: 'WWE', wrestling: 88, entertainment: 95, starPower: 99, intimidation: 90, sexAppeal: 92, height: 196, weight: 118 },
  { id: 3, name: 'John Cena', promotion: 'WWE', wrestling: 85, entertainment: 92, starPower: 97, intimidation: 88, sexAppeal: 90, height: 185, weight: 113 },
  { id: 4, name: 'Stone Cold Steve Austin', promotion: 'WWE', wrestling: 90, entertainment: 94, starPower: 98, intimidation: 96, sexAppeal: 88, height: 188, weight: 115 },
  { id: 5, name: 'Brock Lesnar', promotion: 'WWE', wrestling: 93, entertainment: 75, starPower: 92, intimidation: 98, sexAppeal: 87, height: 193, weight: 130 },
  { id: 6, name: 'The Undertaker', promotion: 'WWE', wrestling: 91, entertainment: 89, starPower: 96, intimidation: 94, sexAppeal: 86, height: 208, weight: 125 },
  { id: 7, name: 'Triple H', promotion: 'WWE', wrestling: 88, entertainment: 85, starPower: 90, intimidation: 92, sexAppeal: 84, height: 193, weight: 120 },
  { id: 8, name: 'Shawn Michaels', promotion: 'WWE', wrestling: 92, entertainment: 94, starPower: 93, intimidation: 80, sexAppeal: 89, height: 180, weight: 95 },
  { id: 9, name: 'Hulk Hogan', promotion: 'WWE', wrestling: 80, entertainment: 92, starPower: 97, intimidation: 88, sexAppeal: 85, height: 201, weight: 130 },
  { id: 10, name: 'Ric Flair', promotion: 'WWE', wrestling: 89, entertainment: 96, starPower: 95, intimidation: 82, sexAppeal: 88, height: 185, weight: 110 },
  // Add more WWE wrestlers...
  ...generateWrestlers('WWE', 11, 500, 'WWE Superstars'),

  // AEW Wrestlers (400+)
  { id: 501, name: 'CM Punk', promotion: 'AEW', wrestling: 91, entertainment: 93, starPower: 92, intimidation: 85, sexAppeal: 86, height: 188, weight: 105 },
  { id: 502, name: 'Jon Moxley', promotion: 'AEW', wrestling: 90, entertainment: 87, starPower: 88, intimidation: 93, sexAppeal: 84, height: 185, weight: 110 },
  { id: 503, name: 'Kenny Omega', promotion: 'AEW', wrestling: 94, entertainment: 90, starPower: 91, intimidation: 82, sexAppeal: 87, height: 183, weight: 100 },
  { id: 504, name: 'Chris Jericho', promotion: 'AEW', wrestling: 89, entertainment: 92, starPower: 90, intimidation: 84, sexAppeal: 85, height: 188, weight: 108 },
  { id: 505, name: 'MJF', promotion: 'AEW', wrestling: 86, entertainment: 91, starPower: 89, intimidation: 80, sexAppeal: 88, height: 188, weight: 102 },
  ...generateWrestlers('AEW', 506, 400, 'AEW Wrestlers'),

  // NJPW Wrestlers (400+)
  { id: 906, name: 'Kazuchika Okada', promotion: 'NJPW', wrestling: 95, entertainment: 88, starPower: 93, intimidation: 85, sexAppeal: 86, height: 187, weight: 110 },
  { id: 907, name: 'Tetsuya Naito', promotion: 'NJPW', wrestling: 92, entertainment: 89, starPower: 91, intimidation: 83, sexAppeal: 87, height: 185, weight: 105 },
  { id: 908, name: 'Hiroshi Tanahashi', promotion: 'NJPW', wrestling: 91, entertainment: 90, starPower: 92, intimidation: 81, sexAppeal: 88, height: 188, weight: 108 },
  { id: 909, name: 'Shinsuke Nakamura', promotion: 'NJPW', wrestling: 93, entertainment: 87, starPower: 90, intimidation: 84, sexAppeal: 89, height: 183, weight: 102 },
  ...generateWrestlers('NJPW', 910, 400, 'NJPW Wrestlers'),

  // TNA Wrestlers (300+)
  { id: 1310, name: 'Sting', promotion: 'TNA', wrestling: 89, entertainment: 88, starPower: 91, intimidation: 86, sexAppeal: 83, height: 188, weight: 110 },
  { id: 1311, name: 'Kurt Angle', promotion: 'TNA', wrestling: 92, entertainment: 85, starPower: 89, intimidation: 87, sexAppeal: 84, height: 180, weight: 105 },
  ...generateWrestlers('TNA', 1312, 300, 'TNA Wrestlers'),

  // ROH Wrestlers (300+)
  { id: 1612, name: 'Bryan Danielson', promotion: 'ROH', wrestling: 94, entertainment: 86, starPower: 88, intimidation: 83, sexAppeal: 82, height: 183, weight: 98 },
  ...generateWrestlers('ROH', 1613, 300, 'ROH Wrestlers'),

  // CMLL Wrestlers (250+)
  { id: 1913, name: 'Místico', promotion: 'CMLL', wrestling: 88, entertainment: 85, starPower: 85, intimidation: 78, sexAppeal: 86, height: 175, weight: 85 },
  ...generateWrestlers('CMLL', 1914, 250, 'CMLL Wrestlers'),

  // Independent Wrestlers (2000+)
  ...generateWrestlers('Independente', 2164, 2000, 'Independent Wrestlers'),
];

/**
 * Generate random wrestlers for a promotion
 */
function generateWrestlers(promotion, startId, count, namePrefix) {
  const wrestlers = [];
  const styles = ['Técnico', 'Poder', 'Aéreo', 'Brawler', 'Psicólogo', 'Showman'];
  const firstNames = ['Alex', 'Blake', 'Chris', 'Dakota', 'Eric', 'Felix', 'Gabriel', 'Hunter', 'Ivan', 'Jake', 'Kyle', 'Logan', 'Marcus', 'Nathan', 'Oscar', 'Parker', 'Quinn', 'Ryan', 'Seth', 'Tyler', 'Ulysses', 'Victor', 'Wesley', 'Xavier', 'Yuri', 'Zane'];
  const lastNames = ['Storm', 'Thunder', 'Knight', 'Shadow', 'Phoenix', 'Dragon', 'Viper', 'Reaper', 'Titan', 'Blaze', 'Inferno', 'Cyclone', 'Hammer', 'Steel', 'Stone', 'Savage', 'Fury', 'Rage', 'Chaos', 'Void'];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];

    // Generate realistic attributes based on style
    let wrestling, entertainment, starPower, intimidation, sexAppeal;

    switch (style) {
      case 'Técnico':
        wrestling = 75 + Math.random() * 20;
        entertainment = 65 + Math.random() * 20;
        starPower = 60 + Math.random() * 25;
        intimidation = 60 + Math.random() * 20;
        sexAppeal = 60 + Math.random() * 25;
        break;
      case 'Poder':
        wrestling = 70 + Math.random() * 20;
        entertainment = 60 + Math.random() * 20;
        starPower = 65 + Math.random() * 25;
        intimidation = 75 + Math.random() * 20;
        sexAppeal = 65 + Math.random() * 25;
        break;
      case 'Aéreo':
        wrestling = 75 + Math.random() * 20;
        entertainment = 70 + Math.random() * 20;
        starPower = 65 + Math.random() * 25;
        intimidation = 55 + Math.random() * 20;
        sexAppeal = 70 + Math.random() * 25;
        break;
      case 'Showman':
        wrestling = 65 + Math.random() * 20;
        entertainment = 80 + Math.random() * 15;
        starPower = 75 + Math.random() * 20;
        intimidation = 60 + Math.random() * 20;
        sexAppeal = 75 + Math.random() * 20;
        break;
      default:
        wrestling = 60 + Math.random() * 30;
        entertainment = 60 + Math.random() * 30;
        starPower = 60 + Math.random() * 30;
        intimidation = 60 + Math.random() * 30;
        sexAppeal = 60 + Math.random() * 30;
    }

    wrestlers.push({
      id: startId + i,
      name: `${firstName} ${lastName}`,
      promotion,
      wrestling: Math.round(wrestling),
      entertainment: Math.round(entertainment),
      starPower: Math.round(starPower),
      intimidation: Math.round(intimidation),
      sexAppeal: Math.round(sexAppeal),
      height: 170 + Math.floor(Math.random() * 35),
      weight: 80 + Math.floor(Math.random() * 60),
      style,
    });
  }

  return wrestlers;
}

export const expandedPromotions = [
  // Major Promotions
  { id: 1, name: 'WWE', country: 'USA', founded: 1953, wrestlers: 500, titles: 15 },
  { id: 2, name: 'AEW', country: 'USA', founded: 2019, wrestlers: 400, titles: 8 },
  { id: 3, name: 'NJPW', country: 'Japan', founded: 1972, wrestlers: 400, titles: 12 },
  { id: 4, name: 'TNA', country: 'USA', founded: 2002, wrestlers: 300, titles: 10 },
  { id: 5, name: 'ROH', country: 'USA', founded: 2002, wrestlers: 300, titles: 8 },
  { id: 6, name: 'CMLL', country: 'Mexico', founded: 1933, wrestlers: 250, titles: 7 },
  { id: 7, name: 'AAA', country: 'Mexico', founded: 1992, wrestlers: 200, titles: 6 },
  { id: 8, name: 'IMPACT', country: 'USA', founded: 2005, wrestlers: 180, titles: 7 },
  { id: 9, name: 'MLW', country: 'USA', founded: 2017, wrestlers: 150, titles: 5 },
  { id: 10, name: 'GCW', country: 'USA', founded: 2012, wrestlers: 120, titles: 4 },
  // Add more promotions...
  ...generatePromotions(11, 90, 'Independent Promotions'),
];

function generatePromotions(startId, count, namePrefix) {
  const promotions = [];
  const countries = ['USA', 'Japan', 'Mexico', 'Canada', 'UK', 'Germany', 'Australia', 'Brazil', 'India', 'France'];
  const prefixes = ['Pro', 'Elite', 'United', 'Global', 'Premier', 'Supreme', 'Victory', 'Titan', 'Empire', 'Dynasty'];
  const suffixes = ['Wrestling', 'Combat', 'Sports', 'Federation', 'Alliance', 'League', 'Championship', 'Promotions'];

  for (let i = 0; i < count; i++) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];

    promotions.push({
      id: startId + i,
      name: `${prefix} ${suffix}`,
      country,
      founded: 1990 + Math.floor(Math.random() * 35),
      wrestlers: 50 + Math.floor(Math.random() * 150),
      titles: 2 + Math.floor(Math.random() * 8),
    });
  }

  return promotions;
}

export const expandedTitles = [
  // WWE Titles
  { id: 1, name: 'WWE Championship', promotion: 'WWE', type: 'World', prestige: 100, history: 'O título mais importante da WWE' },
  { id: 2, name: 'WWE Universal Championship', promotion: 'WWE', type: 'World', prestige: 95, history: 'Segundo título mundial da WWE' },
  { id: 3, name: 'WWE Intercontinental Championship', promotion: 'WWE', type: 'Mid-Card', prestige: 80, history: 'Título de meio de card' },
  { id: 4, name: 'WWE United States Championship', promotion: 'WWE', type: 'Mid-Card', prestige: 75, history: 'Título dos EUA' },
  { id: 5, name: 'WWE Tag Team Championship', promotion: 'WWE', type: 'Tag Team', prestige: 85, history: 'Título de duplas' },
  // AEW Titles
  { id: 6, name: 'AEW World Championship', promotion: 'AEW', type: 'World', prestige: 90, history: 'Título mundial da AEW' },
  { id: 7, name: 'AEW TNT Championship', promotion: 'AEW', type: 'Mid-Card', prestige: 75, history: 'Título de TV' },
  // NJPW Titles
  { id: 8, name: 'IWGP Heavyweight Championship', promotion: 'NJPW', type: 'World', prestige: 95, history: 'Título mais importante da NJPW' },
  { id: 9, name: 'IWGP Intercontinental Championship', promotion: 'NJPW', type: 'Mid-Card', prestige: 80, history: 'Título intercontinental' },
  // Add more titles...
  ...generateTitles(10, 90, 'Other Titles'),
];

function generateTitles(startId, count, namePrefix) {
  const titles = [];
  const types = ['World', 'Mid-Card', 'Tag Team', 'Women', 'Cruiserweight', 'Television', 'Hardcore'];
  const adjectives = ['International', 'National', 'Regional', 'Continental', 'Intercontinental', 'Universal', 'Supreme'];
  const nouns = ['Championship', 'Title', 'Crown', 'Belt', 'Throne', 'Scepter', 'Trophy'];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    titles.push({
      id: startId + i,
      name: `${adj} ${noun}`,
      promotion: `Promotion ${Math.floor(Math.random() * 100)}`,
      type,
      prestige: 50 + Math.floor(Math.random() * 50),
      history: `Título histórico de wrestling`,
    });
  }

  return titles;
}
