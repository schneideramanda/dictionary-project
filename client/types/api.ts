export type ApiErrorBody = {
  error: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  id: string;
  name: string;
};

export type WordEntry = {
  word: string;
  added: string;
};

export interface WordEntryDetail {
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

export type PaginatedResult<T> = {
  results: T[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  search?: string;
};
