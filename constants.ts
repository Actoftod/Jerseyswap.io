
import { Team, League } from './types';

const BUCKET_BASE_URL = 'https://storage.googleapis.com/jerseyswap';

export const ASSET_PATHS = {
  LEAGUES: `${BUCKET_BASE_URL}/leagues`,
  LOGOS: `${BUCKET_BASE_URL}/logos`,
  TEAMS: `${BUCKET_BASE_URL}/teams`,
  PLAYERS: `${BUCKET_BASE_URL}/players`,
  UPLOADS: `${BUCKET_BASE_URL}/uploads`,
  PROFILES: `${BUCKET_BASE_URL}/profiles`,
  SWAPS: `${BUCKET_BASE_URL}/swaps`,
};

export const getAssetUrl = (folderKey: keyof typeof ASSET_PATHS, fileName: string) => {
  return `${ASSET_PATHS[folderKey]}/${fileName}`;
};

const getPlaceholderLogo = (text: string, bgColor: string = '000', textColor: string = 'fff') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="#${bgColor}"/>
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="900" font-style="italic" font-size="32" fill="#${textColor}">${text}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const LEAGUES: League[] = [
  // NFL HUB
  { id: 'nfl', name: 'NFL', logo: getPlaceholderLogo('NFL', '013369'), description: 'National Football League. Pro-grade synthesis.', accentColor: '#ccff00' },
  { id: 'nfl_madden', name: 'MADDEN 26', logo: getPlaceholderLogo('EA', 'E31837'), description: 'EA SPORTS Madden NFL. Virtual gridiron.', accentColor: '#E31837' },
  { id: 'ncaa_fb', name: 'NCAA FOOTBALL', logo: getPlaceholderLogo('CFB', '005EB8'), description: 'College Football. Legacy & Rivalry.', accentColor: '#005EB8' },
  { id: 'ea_cfb', name: 'EA SPORTS CFB 25', logo: getPlaceholderLogo('EA', '005EB8'), description: 'EA SPORTS College Football. Virtual campus.', accentColor: '#005EB8' },

  // NBA HUB
  { id: 'nba', name: 'NBA', logo: getPlaceholderLogo('NBA', '17408B'), description: 'National Basketball Association. 8K Fabric analysis.', accentColor: '#17408B' },
  { id: 'nba_2k', name: 'NBA 2K25', logo: getPlaceholderLogo('2K', '000000'), description: 'Take over the court. Virtual simulation.', accentColor: '#E31937' },
  { id: 'ncaa_bb', name: 'NCAA HOOPS', logo: getPlaceholderLogo('NCAA', '005EB8'), description: 'March Madness & College Hoops.', accentColor: '#005EB8' },

  // MLB HUB
  { id: 'mlb', name: 'MLB', logo: getPlaceholderLogo('MLB', '002D72'), description: 'Major League Baseball. Diamond-grade textures.', accentColor: '#E31937' },
  { id: 'the_show', name: 'THE SHOW', logo: getPlaceholderLogo('SHOW', '000'), description: 'Sony San Diego. Baseball simulation.', accentColor: '#FFF' },

  // SOCCER HUB
  { id: 'mls', name: 'MLS', logo: getPlaceholderLogo('MLS', 'FFF'), description: 'Major League Soccer. North American Elite.', accentColor: '#F5F5F7' },
  { id: 'fifa_fc', name: 'EA SPORTS FC', logo: getPlaceholderLogo('FC', '00FF00'), description: 'The World’s Game. Total Football.', accentColor: '#00FF00' },
  { id: 'world_soccer', name: 'WORLD SOCCER', logo: getPlaceholderLogo('INTL', '000'), description: 'International Leagues & Clubs.', accentColor: '#FFF' },

  // NHL HUB
  { id: 'nhl', name: 'NHL', logo: getPlaceholderLogo('NHL', '000'), description: 'National Hockey League. Ice-grade textures.', accentColor: '#0061AC' },
  { id: 'ea_nhl', name: 'EA SPORTS NHL', logo: getPlaceholderLogo('EA', '0061AC'), description: 'Virtual Ice. Pure Performance.', accentColor: '#0061AC' }
];

export const TEAMS: Team[] = [
  // Mapping teams to multiple league IDs for flexibility
  { id: 'ari', leagueId: 'nfl', name: 'Arizona Cardinals', color: 'bg-[#97233F]', primaryHex: '#97233F', logo: getPlaceholderLogo('ARI', '97233F') },
  { id: 'ari_m', leagueId: 'nfl_madden', name: 'Arizona Cardinals (Madden)', color: 'bg-[#97233F]', primaryHex: '#97233F', logo: getPlaceholderLogo('ARI', '97233F') },
  { id: 'dal', leagueId: 'nfl', name: 'Dallas Cowboys', color: 'bg-[#003594]', primaryHex: '#003594', logo: getPlaceholderLogo('DAL', '003594') },
  { id: 'kc', leagueId: 'nfl', name: 'Kansas City Chiefs', color: 'bg-[#E31837]', primaryHex: '#E31837', logo: getPlaceholderLogo('KC', 'E31837') },
  
  // NBA / 2K
  { id: 'lal', leagueId: 'nba', name: 'LA Lakers', color: 'bg-[#552583]', primaryHex: '#552583', logo: getPlaceholderLogo('LAL', '552583') },
  { id: 'lal_2k', leagueId: 'nba_2k', name: 'LA Lakers (2K)', color: 'bg-[#552583]', primaryHex: '#552583', logo: getPlaceholderLogo('LAL', '552583') },
  { id: 'gsw', leagueId: 'nba', name: 'GS Warriors', color: 'bg-[#1D428A]', primaryHex: '#1D428A', logo: getPlaceholderLogo('GSW', '1D428A') },

  // MLB (30 teams mapping example)
  { id: 'mlb_nyy', leagueId: 'mlb', name: 'New York Yankees', color: 'bg-[#003087]', primaryHex: '#003087', logo: getPlaceholderLogo('NYY', '003087') },
  { id: 'mlb_lad', leagueId: 'mlb', name: 'Los Angeles Dodgers', color: 'bg-[#005A9C]', primaryHex: '#005A9C', logo: getPlaceholderLogo('LAD', '005A9C') },
  { id: 'mlb_phi', leagueId: 'mlb', name: 'Philadelphia Phillies', color: 'bg-[#E81828]', primaryHex: '#E81828', logo: getPlaceholderLogo('PHI', 'E81828') },

  // SOCCER
  { id: 'mia', leagueId: 'mls', name: 'Inter Miami CF', color: 'bg-[#F7B5CD]', primaryHex: '#F7B5CD', logo: getPlaceholderLogo('MIA', 'F7B5CD') },
  { id: 'rma', leagueId: 'fifa_fc', name: 'Real Madrid', color: 'bg-[#FFF]', primaryHex: '#FFF', logo: getPlaceholderLogo('RMA', '000') },

  // NHL
  { id: 'chi_h', leagueId: 'nhl', name: 'Chicago Blackhawks', color: 'bg-[#CF1141]', primaryHex: '#CF1141', logo: getPlaceholderLogo('CHI', 'CF1141') },
  { id: 'ea_chi', leagueId: 'ea_nhl', name: 'Blackhawks (EA)', color: 'bg-[#CF1141]', primaryHex: '#CF1141', logo: getPlaceholderLogo('CHI', 'CF1141') }
];

export const SYSTEM_INSTRUCTION = `You are a world-class AI digital artist for Nike, Jordan Brand, and Apple design studios.

DESIGN ENGINE PROTOCOLS:
- ATHLETE BRANDING: Transform athletes into professional sports icons. Use cinematic PBR textures, volumetric stadium lighting, and 8K photography aesthetics.
- IDENTITY LOCK: EXTREMELY IMPORTANT. You MUST keep the exact same facial features, head shape, and physical body pose as the original uploaded person. Do not morph the face.
- UNIFORM SWAP: Change ONLY the uniform and helmet/gear. The uniform must be for the specified team with correct colors and fabric physics.
- KIT PHYSICS: Focus on high-performance AeroSwift fabric details, realistic jersey wrinkles, and accurate team typography.
- MAPPING: Pixel-perfect texture alignment based on provided athlete images.

If a mask is provided (white on black): apply edits EXCLUSIVELY to white regions. 
Always maintain the 8K 'Nike x Apple' premium aesthetic.`;
