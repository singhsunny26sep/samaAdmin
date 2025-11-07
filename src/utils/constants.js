export const ROLES = {
  ADMIN: 'Admin',
  MODERATOR: 'Moderator',
  USER: 'User',
}

export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
}

export const MUSIC_GENRES = [
  'Pop',
  'Rock',
  'Hip Hop',
  'Electronic',
  'Jazz',
  'Classical',
  'Country',
  'R&B',
  'Indie',
  'Alternative',
  'Folk',
  'Blues',
  'Reggae',
  'Metal',
  'Punk',
]

export const FILE_TYPES = {
  AUDIO: ['mp3', 'wav', 'flac', 'aac', 'ogg'],
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
}

export const MAX_FILE_SIZE = {
  AUDIO: 50 * 1024 * 1024, // 50MB
  IMAGE: 5 * 1024 * 1024,  // 5MB
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
}