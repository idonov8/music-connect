export const PLATFORM_INFO = {
  spotify: { name: 'Spotify', color: '#1DB954', icon: 'headphones' },
  appleMusic: { name: 'Apple Music', color: '#FA2D48', icon: 'music' },
  youtubeMusic: { name: 'YouTube Music', color: '#FF0000', icon: 'play-circle' },
  youtube: { name: 'YouTube', color: '#FF0000', icon: 'video' },
  tidal: { name: 'Tidal', color: '#000000', icon: 'disc' },
  deezer: { name: 'Deezer', color: '#A238FF', icon: 'headphones' },
  amazonMusic: { name: 'Amazon Music', color: '#25D1DA', icon: 'shopping-bag' },
  soundcloud: { name: 'SoundCloud', color: '#FF5500', icon: 'cloud' },
  pandora: { name: 'Pandora', color: '#224099', icon: 'radio' },
  napster: { name: 'Napster', color: '#000000', icon: 'music' },
  audiomack: { name: 'Audiomack', color: '#FFA200', icon: 'headphones' },
  anghami: { name: 'Anghami', color: '#8A2CE2', icon: 'music' },
  boomplay: { name: 'Boomplay', color: '#00D1FF', icon: 'music' },
  itunes: { name: 'iTunes', color: '#EA4CC0', icon: 'shopping-cart' },
  audius: { name: 'Audius', color: '#CC0FE0', icon: 'headphones' },
  yandex: { name: 'Yandex Music', color: '#FFCC00', icon: 'music' },
};

export function getPlatformInfo(platformKey) {
  if (PLATFORM_INFO[platformKey]) {
    return PLATFORM_INFO[platformKey];
  }
  const name = platformKey.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
  return { name, color: '#666666', icon: 'link' };
}

export function getPlatformKeys() {
  return Object.keys(PLATFORM_INFO);
}
