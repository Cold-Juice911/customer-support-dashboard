import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockTickets } from '../lib/mockData';
import { defaultFilters } from '../lib/preferences';
import { filteredTickets, stats, useTicketStore } from './ticketStore';

beforeEach(() => {
  vi.useRealTimers();
  useTicketStore.setState({
    tickets: createMockTickets(Date.UTC(2026, 8, 11)),
    ...defaultFilters,
    requestState: 'idle',
    error: null,
    selectedTicketId: null,
    sortKey: 'createdAt',
    sortDirection: 'desc',
    toast: null,
  });
});

describe('ticket selectors', () => {
  it('derives complete counts independently of active filters', () => {
    useTicketStore.getState().setStatusFilter('Open');
    expect(stats(useTicketStore.getState())).toEqual({
      total: 18,
      open: 7,
      inProgress: 5,
      resolved: 6,
    });
  });
  it('combines trimmed case-insensitive search, status, and priority', () => {
    const store = useTicketStore.getState();
    store.setSearchQuery('  OLIVIA  ');
    store.setStatusFilter('Open');
    store.setPriorityFilter('High');
    expect(
      filteredTickets(useTicketStore.getState()).map((ticket) => ticket.id),
    ).toEqual(['TCK-1042']);
    store.setPriorityFilter('Low');
    expect(filteredTickets(useTicketStore.getState())).toHaveLength(0);
  });
  it('searches subjects and ticket identifiers', () => {
    useTicketStore.getState().setSearchQuery('duplicate charge');
    expect(
      filteredTickets(useTicketStore.getState()).map((ticket) => ticket.id),
    ).toEqual(['TCK-1041']);
    useTicketStore.getState().setSearchQuery('tck-1042');
    expect(filteredTickets(useTicketStore.getState())).toHaveLength(1);
  });
  it('clears all active filters together', () => {
    useTicketStore.setState({
      searchQuery: 'missing',
      statusFilter: 'Resolved',
      priorityFilter: 'High',
    });
    useTicketStore.getState().clearFilters();
    expect(filteredTickets(useTicketStore.getState())).toHaveLength(18);
  });
  it('sorts without mutating source order and toggles both directions', () => {
    const originalOrder = useTicketStore
      .getState()
      .tickets.map((ticket) => ticket.id);
    useTicketStore.getState().setSort('priority');
    expect(filteredTickets(useTicketStore.getState())[0]?.priority).toBe(
      'High',
    );
    useTicketStore.getState().setSort('priority');
    expect(filteredTickets(useTicketStore.getState())[0]?.priority).toBe('Low');
    useTicketStore.getState().setSort('createdAt');
    expect(filteredTickets(useTicketStore.getState())[0]?.id).toBe('TCK-1042');
    useTicketStore.getState().setSort('createdAt');
    expect(filteredTickets(useTicketStore.getState())[0]?.id).toBe('TCK-1025');
    expect(
      useTicketStore.getState().tickets.map((ticket) => ticket.id),
    ).toEqual(originalOrder);
  });
  it('handles an empty dataset', () => {
    useTicketStore.setState({ tickets: [] });
    expect(filteredTickets(useTicketStore.getState())).toEqual([]);
    expect(stats(useTicketStore.getState())).toEqual({
      total: 0,
      open: 0,
      inProgress: 0,
      resolved: 0,
    });
  });
});

describe('ticket updates', () => {
  it('updates the selected ticket, counts, and filtered queue immediately', () => {
    const store = useTicketStore.getState();
    store.selectTicket('TCK-1042');
    store.setStatusFilter('Open');
    store.updateTicketStatus('TCK-1042', 'Resolved');
    const current = useTicketStore.getState();
    expect(current.selectedTicketId).toBe('TCK-1042');
    expect(
      current.tickets.find((ticket) => ticket.id === current.selectedTicketId)
        ?.status,
    ).toBe('Resolved');
    expect(stats(current)).toEqual({
      total: 18,
      open: 6,
      inProgress: 5,
      resolved: 7,
    });
    expect(filteredTickets(current)).toHaveLength(6);
    expect(current.toast?.message).toBe('Status updated to Resolved');
  });
  it('updates priority and timestamp without losing conversation history', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-12T00:00:00Z'));
    const previous = useTicketStore
      .getState()
      .tickets.find((ticket) => ticket.id === 'TCK-1041');
    useTicketStore.getState().updateTicketPriority('TCK-1041', 'Low');
    const ticket = useTicketStore
      .getState()
      .tickets.find((item) => item.id === 'TCK-1041');
    expect(ticket?.priority).toBe('Low');
    expect(ticket?.updatedAt).toBe('2026-09-12T00:00:00.000Z');
    expect(ticket?.messages).toEqual(previous?.messages);
  });
  it('ignores nonexistent tickets and unchanged values', () => {
    const previous = useTicketStore.getState().tickets;
    useTicketStore.getState().updateTicketStatus('missing', 'Resolved');
    useTicketStore.getState().updateTicketStatus('TCK-1042', 'Open');
    useTicketStore.getState().selectTicket('missing');
    expect(useTicketStore.getState().tickets).toBe(previous);
    expect(useTicketStore.getState().toast).toBeNull();
    expect(useTicketStore.getState().selectedTicketId).toBeNull();
  });
});

describe('mock API lifecycle', () => {
  it('shows loading, reports errors without discarding data, and retries successfully', async () => {
    vi.useFakeTimers();
    const request = useTicketStore.getState().fetchTickets('error');
    expect(useTicketStore.getState().requestState).toBe('loading');
    await vi.runAllTimersAsync();
    await request;
    expect(useTicketStore.getState().requestState).toBe('error');
    expect(useTicketStore.getState().error).toContain('could not be loaded');
    expect(useTicketStore.getState().tickets).toHaveLength(18);
    const retry = useTicketStore.getState().fetchTickets();
    await vi.runAllTimersAsync();
    await retry;
    expect(useTicketStore.getState().requestState).toBe('success');
    expect(useTicketStore.getState().error).toBeNull();
  });
  it('uses the latest response when requests overlap', async () => {
    vi.useFakeTimers();
    const oldRequest = useTicketStore.getState().fetchTickets('error');
    const newRequest = useTicketStore.getState().fetchTickets('empty');
    await vi.runAllTimersAsync();
    await Promise.all([oldRequest, newRequest]);
    expect(useTicketStore.getState().requestState).toBe('success');
    expect(useTicketStore.getState().tickets).toEqual([]);
    expect(useTicketStore.getState().error).toBeNull();
  });
});
