import { afterEach, describe, expect, it, vi } from 'vitest';
import { defaultFilters, loadFilters, saveFilters } from './preferences';

afterEach(() => vi.unstubAllGlobals());

describe('filter preferences', () => {
  it('recovers from corrupted storage and unavailable browser storage', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => '{broken',
      setItem: () => {
        throw new Error('Storage blocked');
      },
    });
    expect(loadFilters()).toEqual(defaultFilters);
    expect(() => saveFilters(defaultFilters)).not.toThrow();
  });
  it('validates untrusted stored values and bounds search length', () => {
    vi.stubGlobal('localStorage', {
      getItem: () =>
        JSON.stringify({
          searchQuery: 'a'.repeat(300),
          statusFilter: 'Invalid',
          priorityFilter: 2,
        }),
    });
    expect(loadFilters()).toEqual({
      searchQuery: 'a'.repeat(200),
      statusFilter: 'All',
      priorityFilter: 'All',
    });
  });
  it('restores valid saved filters', () => {
    const filters = {
      searchQuery: 'invoice',
      statusFilter: 'In Progress',
      priorityFilter: 'High',
    };
    vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(filters) });
    expect(loadFilters()).toEqual(filters);
  });
});
