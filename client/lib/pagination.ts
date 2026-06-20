import { PaginationParams } from '@/types/api';

export function buildQuery(params: PaginationParams) {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.search) search.set('search', String(params.search));
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}
