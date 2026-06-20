'use client';

import useSWR from 'swr';
import { useState } from 'react';
import type { PaginatedResult, PaginationParams, User, WordEntry } from '../types/api';
import { buildQuery } from '@/lib/pagination';
import { fetcher } from '@/lib/client';

export function useCurrentUser() {
  const { data, error, isLoading, mutate } = useSWR<User>('/user/me', fetcher);
  return { user: data, error, isLoading, mutate };
}

export function useMyHistory(initial: PaginationParams = { page: 1, limit: 20 }) {
  const [page, setPage] = useState(initial.page ?? 1);
  const limit = initial.limit ?? 20;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResult<WordEntry>>(
    `/user/me/history${buildQuery({ page, limit })}`,
    fetcher,
    { keepPreviousData: true },
  );

  return { data, error, isLoading, page, setPage, mutate };
}

export function useMyFavorites(initial: PaginationParams = { page: 1, limit: 20 }) {
  const [page, setPage] = useState(initial.page ?? 1);
  const limit = initial.limit ?? 20;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResult<WordEntry>>(
    `/user/me/favorites${buildQuery({ page, limit })}`,
    fetcher,
    { keepPreviousData: true },
  );

  return { data, error, isLoading, page, setPage, mutate };
}
