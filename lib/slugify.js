const INVALID_SLUG_CHARS = /[^a-z0-9]+/g;

export function slugify(value = '') {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(INVALID_SLUG_CHARS, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isBracketedTitle(title = '') {
  return /^\[.*\]$/.test(title.trim());
}

export function unslugify(value = '') {
  return value
    .toString()
    .trim()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
