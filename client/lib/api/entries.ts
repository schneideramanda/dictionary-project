import { PaginationResponse } from '../pagination';
import { api } from './client';

export interface Entry {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: License;
  sourceUrls: string[];
}

export interface Phonetic {
  text?: string;
  audio: string;
  sourceUrl?: string;
  license?: License;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
}

export interface License {
  name: string;
  url: string;
}

export interface EntriesResponse extends PaginationResponse {
  results: string[];
}

export const entriesApi = {
  getEntries: (searchParam: string) =>
    api
      .get<EntriesResponse>(`/entries/en?page=1&limit=10&search=${searchParam}`)
      .then(res => res.data.results),
  getEntry: (word: string) => api.get<Entry[]>(`/entries/en/${word}`).then(res => res.data[0]),
  favoriteWord: (word: string) => api.post(`/entries/en/${word}/favorite`).then(res => res.data),
  unfavoriteWord: (word: string) =>
    api.delete(`/entries/en/${word}/unfavorite`).then(res => res.data),
};
