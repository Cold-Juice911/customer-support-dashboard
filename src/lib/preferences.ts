import {
  isPriority,
  isStatus,
  type PriorityFilter,
  type StatusFilter,
} from './types';

export interface FilterPreferences {
  searchQuery: string;
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
}
export const defaultFilters: FilterPreferences = {
  searchQuery: '',
  statusFilter: 'All',
  priorityFilter: 'All',
};

export function loadFilters(): FilterPreferences {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem('support-filters') ?? 'null',
    );
    if (typeof value !== 'object' || value === null) return defaultFilters;
    return {
      searchQuery:
        'searchQuery' in value && typeof value.searchQuery === 'string'
          ? value.searchQuery.slice(0, 200)
          : '',
      statusFilter:
        'statusFilter' in value && isStatus(value.statusFilter)
          ? value.statusFilter
          : 'All',
      priorityFilter:
        'priorityFilter' in value && isPriority(value.priorityFilter)
          ? value.priorityFilter
          : 'All',
    };
  } catch {
    return defaultFilters;
  }
}

export function saveFilters(filters: FilterPreferences) {
  try {
    localStorage.setItem('support-filters', JSON.stringify(filters));
  } catch {
    /* Preferences remain usable when browser storage is unavailable. */
  }
}
