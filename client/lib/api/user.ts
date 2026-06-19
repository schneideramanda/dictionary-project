import { PaginationResponse } from '../pagination';
import { api } from './client';

export interface FavoriteWordsResponse extends PaginationResponse {
  results: { word: string; added: Date }[];
}

export const userApi = {
  getFavoriteWords: () =>
    api.get<FavoriteWordsResponse>('/user/me/favorites').then(res => res.data.results),
};
