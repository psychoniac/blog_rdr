// src/lib/avatarUtils.js

// Liste de pseudonymes aléatoires style NY 90s
const PREFIXES = ['Brooklyn', 'Bronx', 'Harlem', 'Queens', 'Tape', 'Vinyl', 'Graff', 'Subway', 'Boombox', 'Street'];
const SUFFIXES = ['Rider', 'Writer', 'Master', 'Digger', 'Bboy', 'Poet', 'Groove', 'Rebel', 'Runner', 'Soul'];

export function generateRandomUsername() {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  const num = Math.floor(10 + Math.random() * 89); // Nombre à 2 chiffres
  return `${prefix}${suffix}_${num}`;
}

// Galerie d'avatars prédéfinis via l'API DiceBear (style Pixel / 90s)
export const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Shadow',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Boombox',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Graffiti',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Vinyl',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Bboy',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Rider',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Subway',
];