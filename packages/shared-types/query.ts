export interface Query {
    search: string;
    bangs: string[];
    dateFilter?: 'any' | 'day' | 'week' | 'month' | 'year';
    sortBy?: 'relevance' | 'date';
}
