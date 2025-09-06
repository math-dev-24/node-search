import type { Query } from '../../../packages/shared-types/query';
import type { Result } from '../../../packages/shared-types/result';

export interface SearchEngine {
    name: string;
    search(query: Query, engines?: string[]): Promise<Result>;
}

export interface SearchOptions {
    engines?: string[];
    dateFilter?: 'any' | 'day' | 'week' | 'month' | 'year';
    sortBy?: 'relevance' | 'date';
}