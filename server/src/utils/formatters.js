export const normalizeQuery = value =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

export const normalizeWord = value => (typeof value === 'string' ? value.trim().toLowerCase() : '');
