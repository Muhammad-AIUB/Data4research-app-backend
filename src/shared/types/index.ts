// TypeScript types

export type Sex = 'Male' | 'Female' | 'Other';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}