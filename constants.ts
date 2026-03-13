
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
  // ── NFL ──────────────────────────────────────────────────────────────────
  { id: 'nfl_ari', leagueId: 'nfl', name: 'Arizona Cardinals',      color: 'bg-[#97233F]', primaryHex: '#97233F', logo: getPlaceholderLogo('ARI','97233F') },
  { id: 'nfl_atl', leagueId: 'nfl', name: 'Atlanta Falcons',         color: 'bg-[#A71930]', primaryHex: '#A71930', logo: getPlaceholderLogo('ATL','A71930') },
  { id: 'nfl_bal', leagueId: 'nfl', name: 'Baltimore Ravens',        color: 'bg-[#241773]', primaryHex: '#241773', logo: getPlaceholderLogo('BAL','241773') },
  { id: 'nfl_buf', leagueId: 'nfl', name: 'Buffalo Bills',           color: 'bg-[#00338D]', primaryHex: '#00338D', logo: getPlaceholderLogo('BUF','00338D') },
  { id: 'nfl_car', leagueId: 'nfl', name: 'Carolina Panthers',       color: 'bg-[#0085CA]', primaryHex: '#0085CA', logo: getPlaceholderLogo('CAR','0085CA') },
  { id: 'nfl_chi', leagueId: 'nfl', name: 'Chicago Bears',           color: 'bg-[#0B162A]', primaryHex: '#0B162A', logo: getPlaceholderLogo('CHI','0B162A') },
  { id: 'nfl_cin', leagueId: 'nfl', name: 'Cincinnati Bengals',      color: 'bg-[#FB4F14]', primaryHex: '#FB4F14', logo: getPlaceholderLogo('CIN','FB4F14') },
  { id: 'nfl_cle', leagueId: 'nfl', name: 'Cleveland Browns',        color: 'bg-[#FF3C00]', primaryHex: '#FF3C00', logo: getPlaceholderLogo('CLE','FF3C00') },
  { id: 'nfl_dal', leagueId: 'nfl', name: 'Dallas Cowboys',          color: 'bg-[#003594]', primaryHex: '#003594', logo: getPlaceholderLogo('DAL','003594') },
  { id: 'nfl_den', leagueId: 'nfl', name: 'Denver Broncos',          color: 'bg-[#FB4F14]', primaryHex: '#FB4F14', logo: getPlaceholderLogo('DEN','FB4F14') },
  { id: 'nfl_det', leagueId: 'nfl', name: 'Detroit Lions',           color: 'bg-[#0076B6]', primaryHex: '#0076B6', logo: getPlaceholderLogo('DET','0076B6') },
  { id: 'nfl_gb',  leagueId: 'nfl', name: 'Green Bay Packers',       color: 'bg-[#203731]', primaryHex: '#203731', logo: getPlaceholderLogo('GB','203731') },
  { id: 'nfl_hou', leagueId: 'nfl', name: 'Houston Texans',          color: 'bg-[#03202F]', primaryHex: '#03202F', logo: getPlaceholderLogo('HOU','03202F') },
  { id: 'nfl_ind', leagueId: 'nfl', name: 'Indianapolis Colts',      color: 'bg-[#002C5F]', primaryHex: '#002C5F', logo: getPlaceholderLogo('IND','002C5F') },
  { id: 'nfl_jax', leagueId: 'nfl', name: 'Jacksonville Jaguars',    color: 'bg-[#006778]', primaryHex: '#006778', logo: getPlaceholderLogo('JAX','006778') },
  { id: 'nfl_kc',  leagueId: 'nfl', name: 'Kansas City Chiefs',      color: 'bg-[#E31837]', primaryHex: '#E31837', logo: getPlaceholderLogo('KC','E31837') },
  { id: 'nfl_lv',  leagueId: 'nfl', name: 'Las Vegas Raiders',       color: 'bg-[#000000]', primaryHex: '#000000', logo: getPlaceholderLogo('LV','000') },
  { id: 'nfl_lac', leagueId: 'nfl', name: 'LA Chargers',             color: 'bg-[#0080C6]', primaryHex: '#0080C6', logo: getPlaceholderLogo('LAC','0080C6') },
  { id: 'nfl_lar', leagueId: 'nfl', name: 'LA Rams',                 color: 'bg-[#003594]', primaryHex: '#003594', logo: getPlaceholderLogo('LAR','003594') },
  { id: 'nfl_mia', leagueId: 'nfl', name: 'Miami Dolphins',          color: 'bg-[#008E97]', primaryHex: '#008E97', logo: getPlaceholderLogo('MIA','008E97') },
  { id: 'nfl_min', leagueId: 'nfl', name: 'Minnesota Vikings',       color: 'bg-[#4F2683]', primaryHex: '#4F2683', logo: getPlaceholderLogo('MIN','4F2683') },
  { id: 'nfl_ne',  leagueId: 'nfl', name: 'New England Patriots',    color: 'bg-[#002244]', primaryHex: '#002244', logo: getPlaceholderLogo('NE','002244') },
  { id: 'nfl_no',  leagueId: 'nfl', name: 'New Orleans Saints',      color: 'bg-[#D3BC8D]', primaryHex: '#D3BC8D', logo: getPlaceholderLogo('NO','D3BC8D') },
  { id: 'nfl_nyg', leagueId: 'nfl', name: 'New York Giants',         color: 'bg-[#0B2265]', primaryHex: '#0B2265', logo: getPlaceholderLogo('NYG','0B2265') },
  { id: 'nfl_nyj', leagueId: 'nfl', name: 'New York Jets',           color: 'bg-[#125740]', primaryHex: '#125740', logo: getPlaceholderLogo('NYJ','125740') },
  { id: 'nfl_phi', leagueId: 'nfl', name: 'Philadelphia Eagles',     color: 'bg-[#004C54]', primaryHex: '#004C54', logo: getPlaceholderLogo('PHI','004C54') },
  { id: 'nfl_pit', leagueId: 'nfl', name: 'Pittsburgh Steelers',     color: 'bg-[#FFB612]', primaryHex: '#FFB612', logo: getPlaceholderLogo('PIT','FFB612') },
  { id: 'nfl_sf',  leagueId: 'nfl', name: 'SF 49ERS',                color: 'bg-[#AA0000]', primaryHex: '#AA0000', logo: getPlaceholderLogo('SF','AA0000') },
  { id: 'nfl_sea', leagueId: 'nfl', name: 'Seattle Seahawks',        color: 'bg-[#002244]', primaryHex: '#002244', logo: getPlaceholderLogo('SEA','002244') },
  { id: 'nfl_tb',  leagueId: 'nfl', name: 'Tampa Bay Buccaneers',    color: 'bg-[#D50A0A]', primaryHex: '#D50A0A', logo: getPlaceholderLogo('TB','D50A0A') },
  { id: 'nfl_ten', leagueId: 'nfl', name: 'Tennessee Titans',        color: 'bg-[#0C2340]', primaryHex: '#0C2340', logo: getPlaceholderLogo('TEN','0C2340') },
  { id: 'nfl_wsh', leagueId: 'nfl', name: 'Washington Commanders',   color: 'bg-[#5A1414]', primaryHex: '#5A1414', logo: getPlaceholderLogo('WSH','5A1414') },

  // ── MADDEN ───────────────────────────────────────────────────────────────
  { id: 'md_kc',  leagueId: 'nfl_madden', name: 'Chiefs (Madden)',   color: 'bg-[#E31837]', primaryHex: '#E31837', logo: getPlaceholderLogo('KC','E31837') },
  { id: 'md_dal', leagueId: 'nfl_madden', name: 'Cowboys (Madden)',  color: 'bg-[#003594]', primaryHex: '#003594', logo: getPlaceholderLogo('DAL','003594') },
  { id: 'md_sf',  leagueId: 'nfl_madden', name: '49ers (Madden)',    color: 'bg-[#AA0000]', primaryHex: '#AA0000', logo: getPlaceholderLogo('SF','AA0000') },
  { id: 'md_phi', leagueId: 'nfl_madden', name: 'Eagles (Madden)',   color: 'bg-[#004C54]', primaryHex: '#004C54', logo: getPlaceholderLogo('PHI','004C54') },
  { id: 'md_buf', leagueId: 'nfl_madden', name: 'Bills (Madden)',    color: 'bg-[#00338D]', primaryHex: '#00338D', logo: getPlaceholderLogo('BUF','00338D') },

  // ── NCAA FOOTBALL ────────────────────────────────────────────────────────
  { id: 'cfb_ala', leagueId: 'ncaa_fb',  name: 'Alabama Crimson Tide',   color: 'bg-[#9E1B32]', primaryHex: '#9E1B32', logo: getPlaceholderLogo('ALA','9E1B32') },
  { id: 'cfb_osu', leagueId: 'ncaa_fb',  name: 'Ohio State Buckeyes',    color: 'bg-[#BB0000]', primaryHex: '#BB0000', logo: getPlaceholderLogo('OSU','BB0000') },
  { id: 'cfb_uga', leagueId: 'ncaa_fb',  name: 'Georgia Bulldogs',       color: 'bg-[#BA0C2F]', primaryHex: '#BA0C2F', logo: getPlaceholderLogo('UGA','BA0C2F') },
  { id: 'cfb_tex', leagueId: 'ncaa_fb',  name: 'Texas Longhorns',        color: 'bg-[#BF5700]', primaryHex: '#BF5700', logo: getPlaceholderLogo('TEX','BF5700') },
  { id: 'cfb_umi', leagueId: 'ncaa_fb',  name: 'Michigan Wolverines',    color: 'bg-[#00274C]', primaryHex: '#00274C', logo: getPlaceholderLogo('MICH','00274C') },
  { id: 'cfb_ea_ala', leagueId: 'ea_cfb', name: 'Alabama (EA CFB)',      color: 'bg-[#9E1B32]', primaryHex: '#9E1B32', logo: getPlaceholderLogo('ALA','9E1B32') },
  { id: 'cfb_ea_osu', leagueId: 'ea_cfb', name: 'Ohio State (EA CFB)',   color: 'bg-[#BB0000]', primaryHex: '#BB0000', logo: getPlaceholderLogo('OSU','BB0000') },

  // ── NBA ──────────────────────────────────────────────────────────────────
  { id: 'nba_atl', leagueId: 'nba', name: 'Atlanta Hawks',           color: 'bg-[#E03A3E]', primaryHex: '#E03A3E', logo: getPlaceholderLogo('ATL','E03A3E') },
  { id: 'nba_bos', leagueId: 'nba', name: 'Boston Celtics',          color: 'bg-[#007A33]', primaryHex: '#007A33', logo: getPlaceholderLogo('BOS','007A33') },
  { id: 'nba_bkn', leagueId: 'nba', name: 'Brooklyn Nets',           color: 'bg-[#000000]', primaryHex: '#000000', logo: getPlaceholderLogo('BKN','000') },
  { id: 'nba_cha', leagueId: 'nba', name: 'Charlotte Hornets',       color: 'bg-[#1D1160]', primaryHex: '#1D1160', logo: getPlaceholderLogo('CHA','1D1160') },
  { id: 'nba_chi', leagueId: 'nba', name: 'Chicago Bulls',           color: 'bg-[#CE1141]', primaryHex: '#CE1141', logo: getPlaceholderLogo('CHI','CE1141') },
  { id: 'nba_cle', leagueId: 'nba', name: 'Cleveland Cavaliers',     color: 'bg-[#860038]', primaryHex: '#860038', logo: getPlaceholderLogo('CLE','860038') },
  { id: 'nba_dal', leagueId: 'nba', name: 'Dallas Mavericks',        color: 'bg-[#00538C]', primaryHex: '#00538C', logo: getPlaceholderLogo('DAL','00538C') },
  { id: 'nba_den', leagueId: 'nba', name: 'Denver Nuggets',          color: 'bg-[#0E2240]', primaryHex: '#0E2240', logo: getPlaceholderLogo('DEN','0E2240') },
  { id: 'nba_det', leagueId: 'nba', name: 'Detroit Pistons',         color: 'bg-[#C8102E]', primaryHex: '#C8102E', logo: getPlaceholderLogo('DET','C8102E') },
  { id: 'nba_gsw', leagueId: 'nba', name: 'Golden State Warriors',   color: 'bg-[#1D428A]', primaryHex: '#1D428A', logo: getPlaceholderLogo('GSW','1D428A') },
  { id: 'nba_hou', leagueId: 'nba', name: 'Houston Rockets',         color: 'bg-[#CE1141]', primaryHex: '#CE1141', logo: getPlaceholderLogo('HOU','CE1141') },
  { id: 'nba_ind', leagueId: 'nba', name: 'Indiana Pacers',          color: 'bg-[#002D62]', primaryHex: '#002D62', logo: getPlaceholderLogo('IND','002D62') },
  { id: 'nba_lac', leagueId: 'nba', name: 'LA Clippers',             color: 'bg-[#C8102E]', primaryHex: '#C8102E', logo: getPlaceholderLogo('LAC','C8102E') },
  { id: 'nba_lal', leagueId: 'nba', name: 'LA LAKERS',               color: 'bg-[#552583]', primaryHex: '#552583', logo: getPlaceholderLogo('LAL','552583') },
  { id: 'nba_mem', leagueId: 'nba', name: 'Memphis Grizzlies',       color: 'bg-[#5D76A9]', primaryHex: '#5D76A9', logo: getPlaceholderLogo('MEM','5D76A9') },
  { id: 'nba_mia', leagueId: 'nba', name: 'Miami Heat',              color: 'bg-[#98002E]', primaryHex: '#98002E', logo: getPlaceholderLogo('MIA','98002E') },
  { id: 'nba_mil', leagueId: 'nba', name: 'Milwaukee Bucks',         color: 'bg-[#00471B]', primaryHex: '#00471B', logo: getPlaceholderLogo('MIL','00471B') },
  { id: 'nba_min', leagueId: 'nba', name: 'Minnesota Timberwolves',  color: 'bg-[#0C2340]', primaryHex: '#0C2340', logo: getPlaceholderLogo('MIN','0C2340') },
  { id: 'nba_no',  leagueId: 'nba', name: 'New Orleans Pelicans',    color: 'bg-[#0C2340]', primaryHex: '#0C2340', logo: getPlaceholderLogo('NO','0C2340') },
  { id: 'nba_nyk', leagueId: 'nba', name: 'New York Knicks',         color: 'bg-[#006BB6]', primaryHex: '#006BB6', logo: getPlaceholderLogo('NYK','006BB6') },
  { id: 'nba_okc', leagueId: 'nba', name: 'OKC Thunder',             color: 'bg-[#007AC1]', primaryHex: '#007AC1', logo: getPlaceholderLogo('OKC','007AC1') },
  { id: 'nba_orl', leagueId: 'nba', name: 'Orlando Magic',           color: 'bg-[#0077C0]', primaryHex: '#0077C0', logo: getPlaceholderLogo('ORL','0077C0') },
  { id: 'nba_phi', leagueId: 'nba', name: 'Philadelphia 76ers',      color: 'bg-[#006BB6]', primaryHex: '#006BB6', logo: getPlaceholderLogo('PHI','006BB6') },
  { id: 'nba_phx', leagueId: 'nba', name: 'Phoenix Suns',            color: 'bg-[#1D1160]', primaryHex: '#1D1160', logo: getPlaceholderLogo('PHX','1D1160') },
  { id: 'nba_por', leagueId: 'nba', name: 'Portland Trail Blazers',  color: 'bg-[#E03A3E]', primaryHex: '#E03A3E', logo: getPlaceholderLogo('POR','E03A3E') },
  { id: 'nba_sac', leagueId: 'nba', name: 'Sacramento Kings',        color: 'bg-[#5A2D81]', primaryHex: '#5A2D81', logo: getPlaceholderLogo('SAC','5A2D81') },
  { id: 'nba_sas', leagueId: 'nba', name: 'San Antonio Spurs',       color: 'bg-[#C4CED4]', primaryHex: '#C4CED4', logo: getPlaceholderLogo('SAS','000') },
  { id: 'nba_tor', leagueId: 'nba', name: 'Toronto Raptors',         color: 'bg-[#CE1141]', primaryHex: '#CE1141', logo: getPlaceholderLogo('TOR','CE1141') },
  { id: 'nba_uta', leagueId: 'nba', name: 'Utah Jazz',               color: 'bg-[#002B5C]', primaryHex: '#002B5C', logo: getPlaceholderLogo('UTA','002B5C') },
  { id: 'nba_was', leagueId: 'nba', name: 'Washington Wizards',      color: 'bg-[#002B5C]', primaryHex: '#002B5C', logo: getPlaceholderLogo('WAS','002B5C') },

  // ── NBA 2K ───────────────────────────────────────────────────────────────
  { id: '2k_lal', leagueId: 'nba_2k', name: 'Lakers (2K)',           color: 'bg-[#552583]', primaryHex: '#552583', logo: getPlaceholderLogo('LAL','552583') },
  { id: '2k_bos', leagueId: 'nba_2k', name: 'Celtics (2K)',          color: 'bg-[#007A33]', primaryHex: '#007A33', logo: getPlaceholderLogo('BOS','007A33') },
  { id: '2k_gsw', leagueId: 'nba_2k', name: 'Warriors (2K)',         color: 'bg-[#1D428A]', primaryHex: '#1D428A', logo: getPlaceholderLogo('GSW','1D428A') },

  // ── NCAA BASKETBALL ──────────────────────────────────────────────────────
  { id: 'ncb_duke', leagueId: 'ncaa_bb', name: 'Duke Blue Devils',   color: 'bg-[#003087]', primaryHex: '#003087', logo: getPlaceholderLogo('DUKE','003087') },
  { id: 'ncb_unc',  leagueId: 'ncaa_bb', name: 'UNC Tar Heels',      color: 'bg-[#4B9CD3]', primaryHex: '#4B9CD3', logo: getPlaceholderLogo('UNC','4B9CD3') },
  { id: 'ncb_uk',   leagueId: 'ncaa_bb', name: 'Kentucky Wildcats',  color: 'bg-[#0033A0]', primaryHex: '#0033A0', logo: getPlaceholderLogo('UK','0033A0') },
  { id: 'ncb_ksu',  leagueId: 'ncaa_bb', name: 'Kansas Jayhawks',    color: 'bg-[#0051A5]', primaryHex: '#0051A5', logo: getPlaceholderLogo('KU','0051A5') },

  // ── MLB ──────────────────────────────────────────────────────────────────
  { id: 'mlb_ari', leagueId: 'mlb', name: 'Arizona Diamondbacks',    color: 'bg-[#A71930]', primaryHex: '#A71930', logo: getPlaceholderLogo('ARI','A71930') },
  { id: 'mlb_atl', leagueId: 'mlb', name: 'Atlanta Braves',          color: 'bg-[#CE1141]', primaryHex: '#CE1141', logo: getPlaceholderLogo('ATL','CE1141') },
  { id: 'mlb_bal', leagueId: 'mlb', name: 'Baltimore Orioles',       color: 'bg-[#DF4601]', primaryHex: '#DF4601', logo: getPlaceholderLogo('BAL','DF4601') },
  { id: 'mlb_bos', leagueId: 'mlb', name: 'Boston Red Sox',          color: 'bg-[#BD3039]', primaryHex: '#BD3039', logo: getPlaceholderLogo('BOS','BD3039') },
  { id: 'mlb_chc', leagueId: 'mlb', name: 'Chicago Cubs',            color: 'bg-[#0E3386]', primaryHex: '#0E3386', logo: getPlaceholderLogo('CHC','0E3386') },
  { id: 'mlb_chw', leagueId: 'mlb', name: 'Chicago White Sox',       color: 'bg-[#27251F]', primaryHex: '#27251F', logo: getPlaceholderLogo('CWS','27251F') },
  { id: 'mlb_cin', leagueId: 'mlb', name: 'Cincinnati Reds',         color: 'bg-[#C6011F]', primaryHex: '#C6011F', logo: getPlaceholderLogo('CIN','C6011F') },
  { id: 'mlb_cle', leagueId: 'mlb', name: 'Cleveland Guardians',     color: 'bg-[#E31937]', primaryHex: '#E31937', logo: getPlaceholderLogo('CLE','E31937') },
  { id: 'mlb_col', leagueId: 'mlb', name: 'Colorado Rockies',        color: 'bg-[#33006F]', primaryHex: '#33006F', logo: getPlaceholderLogo('COL','33006F') },
  { id: 'mlb_det', leagueId: 'mlb', name: 'Detroit Tigers',          color: 'bg-[#0C2340]', primaryHex: '#0C2340', logo: getPlaceholderLogo('DET','0C2340') },
  { id: 'mlb_hou', leagueId: 'mlb', name: 'Houston Astros',          color: 'bg-[#002D62]', primaryHex: '#002D62', logo: getPlaceholderLogo('HOU','002D62') },
  { id: 'mlb_kc',  leagueId: 'mlb', name: 'Kansas City Royals',      color: 'bg-[#004687]', primaryHex: '#004687', logo: getPlaceholderLogo('KC','004687') },
  { id: 'mlb_laa', leagueId: 'mlb', name: 'LA Angels',               color: 'bg-[#BA0021]', primaryHex: '#BA0021', logo: getPlaceholderLogo('LAA','BA0021') },
  { id: 'mlb_lad', leagueId: 'mlb', name: 'LA Dodgers',              color: 'bg-[#005A9C]', primaryHex: '#005A9C', logo: getPlaceholderLogo('LAD','005A9C') },
  { id: 'mlb_mia', leagueId: 'mlb', name: 'Miami Marlins',           color: 'bg-[#00A3E0]', primaryHex: '#00A3E0', logo: getPlaceholderLogo('MIA','00A3E0') },
  { id: 'mlb_mil', leagueId: 'mlb', name: 'Milwaukee Brewers',       color: 'bg-[#FFC52F]', primaryHex: '#FFC52F', logo: getPlaceholderLogo('MIL','182B49') },
  { id: 'mlb_min', leagueId: 'mlb', name: 'Minnesota Twins',         color: 'bg-[#002B5C]', primaryHex: '#002B5C', logo: getPlaceholderLogo('MIN','002B5C') },
  { id: 'mlb_nym', leagueId: 'mlb', name: 'New York Mets',           color: 'bg-[#002D72]', primaryHex: '#002D72', logo: getPlaceholderLogo('NYM','002D72') },
  { id: 'mlb_nyy', leagueId: 'mlb', name: 'New York Yankees',        color: 'bg-[#003087]', primaryHex: '#003087', logo: getPlaceholderLogo('NYY','003087') },
  { id: 'mlb_oak', leagueId: 'mlb', name: 'Oakland Athletics',       color: 'bg-[#003831]', primaryHex: '#003831', logo: getPlaceholderLogo('OAK','003831') },
  { id: 'mlb_phi', leagueId: 'mlb', name: 'Philadelphia Phillies',   color: 'bg-[#E81828]', primaryHex: '#E81828', logo: getPlaceholderLogo('PHI','E81828') },
  { id: 'mlb_pit', leagueId: 'mlb', name: 'Pittsburgh Pirates',      color: 'bg-[#27251F]', primaryHex: '#27251F', logo: getPlaceholderLogo('PIT','27251F') },
  { id: 'mlb_sd',  leagueId: 'mlb', name: 'San Diego Padres',        color: 'bg-[#2F241D]', primaryHex: '#2F241D', logo: getPlaceholderLogo('SD','2F241D') },
  { id: 'mlb_sf',  leagueId: 'mlb', name: 'San Francisco Giants',    color: 'bg-[#FD5A1E]', primaryHex: '#FD5A1E', logo: getPlaceholderLogo('SF','FD5A1E') },
  { id: 'mlb_sea', leagueId: 'mlb', name: 'Seattle Mariners',        color: 'bg-[#0C2C56]', primaryHex: '#0C2C56', logo: getPlaceholderLogo('SEA','0C2C56') },
  { id: 'mlb_stl', leagueId: 'mlb', name: 'St. Louis Cardinals',     color: 'bg-[#C41E3A]', primaryHex: '#C41E3A', logo: getPlaceholderLogo('STL','C41E3A') },
  { id: 'mlb_tb',  leagueId: 'mlb', name: 'Tampa Bay Rays',          color: 'bg-[#092C5C]', primaryHex: '#092C5C', logo: getPlaceholderLogo('TB','092C5C') },
  { id: 'mlb_tex', leagueId: 'mlb', name: 'Texas Rangers',           color: 'bg-[#003278]', primaryHex: '#003278', logo: getPlaceholderLogo('TEX','003278') },
  { id: 'mlb_tor', leagueId: 'mlb', name: 'Toronto Blue Jays',       color: 'bg-[#134A8E]', primaryHex: '#134A8E', logo: getPlaceholderLogo('TOR','134A8E') },
  { id: 'mlb_was', leagueId: 'mlb', name: 'Washington Nationals',    color: 'bg-[#AB0003]', primaryHex: '#AB0003', logo: getPlaceholderLogo('WAS','AB0003') },

  // ── THE SHOW ─────────────────────────────────────────────────────────────
  { id: 'show_nyy', leagueId: 'the_show', name: 'Yankees (The Show)',  color: 'bg-[#003087]', primaryHex: '#003087', logo: getPlaceholderLogo('NYY','003087') },
  { id: 'show_lad', leagueId: 'the_show', name: 'Dodgers (The Show)',  color: 'bg-[#005A9C]', primaryHex: '#005A9C', logo: getPlaceholderLogo('LAD','005A9C') },

  // ── MLS SOCCER ───────────────────────────────────────────────────────────
  { id: 'mls_atl', leagueId: 'mls', name: 'Atlanta United',          color: 'bg-[#80000A]', primaryHex: '#80000A', logo: getPlaceholderLogo('ATL','80000A') },
  { id: 'mls_mia', leagueId: 'mls', name: 'Inter Miami CF',          color: 'bg-[#F7B5CD]', primaryHex: '#F7B5CD', logo: getPlaceholderLogo('MIA','000') },
  { id: 'mls_nyrb',leagueId: 'mls', name: 'NY Red Bulls',            color: 'bg-[#ED1B23]', primaryHex: '#ED1B23', logo: getPlaceholderLogo('NYRB','ED1B23') },
  { id: 'mls_lafc',leagueId: 'mls', name: 'LAFC',                    color: 'bg-[#000000]', primaryHex: '#000000', logo: getPlaceholderLogo('LAFC','000') },
  { id: 'mls_sea', leagueId: 'mls', name: 'Seattle Sounders',        color: 'bg-[#5D9732]', primaryHex: '#5D9732', logo: getPlaceholderLogo('SEA','5D9732') },

  // ── EA FC (World Soccer) ──────────────────────────────────────────────────
  { id: 'fc_rma', leagueId: 'fifa_fc', name: 'Real Madrid',          color: 'bg-[#FEBE10]', primaryHex: '#FEBE10', logo: getPlaceholderLogo('RMA','000') },
  { id: 'fc_fcb', leagueId: 'fifa_fc', name: 'FC Barcelona',         color: 'bg-[#A50044]', primaryHex: '#A50044', logo: getPlaceholderLogo('FCB','A50044') },
  { id: 'fc_mci', leagueId: 'fifa_fc', name: 'Manchester City',      color: 'bg-[#6CABDD]', primaryHex: '#6CABDD', logo: getPlaceholderLogo('MCI','6CABDD') },
  { id: 'fc_mun', leagueId: 'fifa_fc', name: 'Manchester United',    color: 'bg-[#DA291C]', primaryHex: '#DA291C', logo: getPlaceholderLogo('MUN','DA291C') },
  { id: 'fc_psg', leagueId: 'fifa_fc', name: 'Paris Saint-Germain',  color: 'bg-[#004170]', primaryHex: '#004170', logo: getPlaceholderLogo('PSG','004170') },
  { id: 'fc_che', leagueId: 'fifa_fc', name: 'Chelsea FC',           color: 'bg-[#034694]', primaryHex: '#034694', logo: getPlaceholderLogo('CHE','034694') },
  { id: 'fc_juve',leagueId: 'world_soccer', name: 'Juventus',        color: 'bg-[#000000]', primaryHex: '#000000', logo: getPlaceholderLogo('JUV','000') },
  { id: 'fc_bay', leagueId: 'world_soccer', name: 'Bayern Munich',   color: 'bg-[#DC052D]', primaryHex: '#DC052D', logo: getPlaceholderLogo('FCB','DC052D') },
  { id: 'fc_bra', leagueId: 'world_soccer', name: 'Brazil NT',       color: 'bg-[#009C3B]', primaryHex: '#009C3B', logo: getPlaceholderLogo('BRA','009C3B') },
  { id: 'fc_arg', leagueId: 'world_soccer', name: 'Argentina NT',    color: 'bg-[#74ACDF]', primaryHex: '#74ACDF', logo: getPlaceholderLogo('ARG','74ACDF') },

  // ── NHL ──────────────────────────────────────────────────────────────────
  { id: 'nhl_ana', leagueId: 'nhl', name: 'Anaheim Ducks',           color: 'bg-[#F47A38]', primaryHex: '#F47A38', logo: getPlaceholderLogo('ANA','F47A38') },
  { id: 'nhl_bos', leagueId: 'nhl', name: 'Boston Bruins',           color: 'bg-[#FFB81C]', primaryHex: '#FFB81C', logo: getPlaceholderLogo('BOS','000') },
  { id: 'nhl_buf', leagueId: 'nhl', name: 'Buffalo Sabres',          color: 'bg-[#003087]', primaryHex: '#003087', logo: getPlaceholderLogo('BUF','003087') },
  { id: 'nhl_car', leagueId: 'nhl', name: 'Carolina Hurricanes',     color: 'bg-[#CC0000]', primaryHex: '#CC0000', logo: getPlaceholderLogo('CAR','CC0000') },
  { id: 'nhl_cbj', leagueId: 'nhl', name: 'Columbus Blue Jackets',   color: 'bg-[#002654]', primaryHex: '#002654', logo: getPlaceholderLogo('CBJ','002654') },
  { id: 'nhl_cgy', leagueId: 'nhl', name: 'Calgary Flames',          color: 'bg-[#C8102E]', primaryHex: '#C8102E', logo: getPlaceholderLogo('CGY','C8102E') },
  { id: 'nhl_chi', leagueId: 'nhl', name: 'Chicago Blackhawks',      color: 'bg-[#CF1141]', primaryHex: '#CF1141', logo: getPlaceholderLogo('CHI','CF1141') },
  { id: 'nhl_col', leagueId: 'nhl', name: 'Colorado Avalanche',      color: 'bg-[#6F263D]', primaryHex: '#6F263D', logo: getPlaceholderLogo('COL','6F263D') },
  { id: 'nhl_dal', leagueId: 'nhl', name: 'Dallas Stars',            color: 'bg-[#006847]', primaryHex: '#006847', logo: getPlaceholderLogo('DAL','006847') },
  { id: 'nhl_det', leagueId: 'nhl', name: 'Detroit Red Wings',       color: 'bg-[#CE1126]', primaryHex: '#CE1126', logo: getPlaceholderLogo('DET','CE1126') },
  { id: 'nhl_edm', leagueId: 'nhl', name: 'Edmonton Oilers',         color: 'bg-[#041E42]', primaryHex: '#041E42', logo: getPlaceholderLogo('EDM','041E42') },
  { id: 'nhl_fla', leagueId: 'nhl', name: 'Florida Panthers',        color: 'bg-[#041E42]', primaryHex: '#041E42', logo: getPlaceholderLogo('FLA','041E42') },
  { id: 'nhl_lak', leagueId: 'nhl', name: 'LA Kings',                color: 'bg-[#111111]', primaryHex: '#111111', logo: getPlaceholderLogo('LAK','000') },
  { id: 'nhl_min', leagueId: 'nhl', name: 'Minnesota Wild',          color: 'bg-[#154734]', primaryHex: '#154734', logo: getPlaceholderLogo('MIN','154734') },
  { id: 'nhl_mtl', leagueId: 'nhl', name: 'Montreal Canadiens',      color: 'bg-[#AF1E2D]', primaryHex: '#AF1E2D', logo: getPlaceholderLogo('MTL','AF1E2D') },
  { id: 'nhl_nsh', leagueId: 'nhl', name: 'Nashville Predators',     color: 'bg-[#FFB81C]', primaryHex: '#FFB81C', logo: getPlaceholderLogo('NSH','041E42') },
  { id: 'nhl_njd', leagueId: 'nhl', name: 'New Jersey Devils',       color: 'bg-[#CE1126]', primaryHex: '#CE1126', logo: getPlaceholderLogo('NJD','CE1126') },
  { id: 'nhl_nyi', leagueId: 'nhl', name: 'NY Islanders',            color: 'bg-[#00539B]', primaryHex: '#00539B', logo: getPlaceholderLogo('NYI','00539B') },
  { id: 'nhl_nyr', leagueId: 'nhl', name: 'NY Rangers',              color: 'bg-[#0038A8]', primaryHex: '#0038A8', logo: getPlaceholderLogo('NYR','0038A8') },
  { id: 'nhl_ott', leagueId: 'nhl', name: 'Ottawa Senators',         color: 'bg-[#C52032]', primaryHex: '#C52032', logo: getPlaceholderLogo('OTT','C52032') },
  { id: 'nhl_phi', leagueId: 'nhl', name: 'Philadelphia Flyers',     color: 'bg-[#F74902]', primaryHex: '#F74902', logo: getPlaceholderLogo('PHI','F74902') },
  { id: 'nhl_pit', leagueId: 'nhl', name: 'Pittsburgh Penguins',     color: 'bg-[#000000]', primaryHex: '#000000', logo: getPlaceholderLogo('PIT','000') },
  { id: 'nhl_sea', leagueId: 'nhl', name: 'Seattle Kraken',          color: 'bg-[#001628]', primaryHex: '#001628', logo: getPlaceholderLogo('SEA','001628') },
  { id: 'nhl_sjs', leagueId: 'nhl', name: 'San Jose Sharks',         color: 'bg-[#006D75]', primaryHex: '#006D75', logo: getPlaceholderLogo('SJS','006D75') },
  { id: 'nhl_stl', leagueId: 'nhl', name: 'St. Louis Blues',         color: 'bg-[#002F87]', primaryHex: '#002F87', logo: getPlaceholderLogo('STL','002F87') },
  { id: 'nhl_tbl', leagueId: 'nhl', name: 'Tampa Bay Lightning',     color: 'bg-[#002868]', primaryHex: '#002868', logo: getPlaceholderLogo('TBL','002868') },
  { id: 'nhl_tor', leagueId: 'nhl', name: 'Toronto Maple Leafs',     color: 'bg-[#003E7E]', primaryHex: '#003E7E', logo: getPlaceholderLogo('TOR','003E7E') },
  { id: 'nhl_van', leagueId: 'nhl', name: 'Vancouver Canucks',       color: 'bg-[#001F5B]', primaryHex: '#001F5B', logo: getPlaceholderLogo('VAN','001F5B') },
  { id: 'nhl_vgk', leagueId: 'nhl', name: 'Vegas Golden Knights',    color: 'bg-[#B4975A]', primaryHex: '#B4975A', logo: getPlaceholderLogo('VGK','333') },
  { id: 'nhl_wpg', leagueId: 'nhl', name: 'Winnipeg Jets',           color: 'bg-[#041E42]', primaryHex: '#041E42', logo: getPlaceholderLogo('WPG','041E42') },
  { id: 'nhl_wsh', leagueId: 'nhl', name: 'Washington Capitals',     color: 'bg-[#041E42]', primaryHex: '#041E42', logo: getPlaceholderLogo('WSH','041E42') },

  // ── EA NHL ───────────────────────────────────────────────────────────────
  { id: 'ea_tor', leagueId: 'ea_nhl', name: 'Maple Leafs (EA)',      color: 'bg-[#003E7E]', primaryHex: '#003E7E', logo: getPlaceholderLogo('TOR','003E7E') },
  { id: 'ea_bos', leagueId: 'ea_nhl', name: 'Bruins (EA)',           color: 'bg-[#FFB81C]', primaryHex: '#FFB81C', logo: getPlaceholderLogo('BOS','000') },
  { id: 'ea_chi', leagueId: 'ea_nhl', name: 'Blackhawks (EA)',       color: 'bg-[#CF1141]', primaryHex: '#CF1141', logo: getPlaceholderLogo('CHI','CF1141') },
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
