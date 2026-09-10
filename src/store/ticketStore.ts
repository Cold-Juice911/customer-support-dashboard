import { create } from 'zustand';
import { fetchTickets } from '../lib/api';
import {
  defaultFilters,
  loadFilters,
  saveFilters,
  type FilterPreferences,
} from '../lib/preferences';
import type {
  DemoMode,
  Priority,
  RequestState,
  SortDirection,
  SortKey,
  Status,
  Ticket,
  TicketStats,
} from '../lib/types';

export interface TicketStore extends FilterPreferences {
  tickets: Ticket[];
  requestState: RequestState;
  error: string | null;
  selectedTicketId: string | null;
  sortKey: SortKey;
  sortDirection: SortDirection;
  toast: { id: number; message: string } | null;
  fetchTickets: (mode?: DemoMode) => Promise<void>;
  setSearchQuery: (value: string) => void;
  setStatusFilter: (value: FilterPreferences['statusFilter']) => void;
  setPriorityFilter: (value: FilterPreferences['priorityFilter']) => void;
  clearFilters: () => void;
  selectTicket: (id: string | null) => void;
  updateTicketStatus: (id: string, status: Status) => void;
  updateTicketPriority: (id: string, priority: Priority) => void;
  setSort: (key: SortKey) => void;
  dismissToast: () => void;
}

export const useTicketStore = create<TicketStore>()((set, get) => {
  let requestId = 0;
  let toastId = 0;
  const updateTicket = (
    id: string,
    patch: Partial<Pick<Ticket, 'status' | 'priority'>>,
    message: string,
  ) => {
    const ticket = get().tickets.find((item) => item.id === id);
    if (
      !ticket ||
      Object.entries(patch).every(
        ([key, value]) => ticket[key as keyof typeof patch] === value,
      )
    )
      return;
    set((state) => ({
      tickets: state.tickets.map((item) =>
        item.id === id
          ? { ...item, ...patch, updatedAt: new Date().toISOString() }
          : item,
      ),
      toast: { id: ++toastId, message },
    }));
  };
  return {
    ...loadFilters(),
    tickets: [],
    requestState: 'idle',
    error: null,
    selectedTicketId: null,
    sortKey: 'createdAt',
    sortDirection: 'desc',
    toast: null,
    fetchTickets: async (mode = 'normal') => {
      const currentRequest = ++requestId;
      set({ requestState: 'loading', error: null });
      try {
        const tickets = await fetchTickets(mode);
        if (currentRequest === requestId)
          set({ tickets, requestState: 'success', selectedTicketId: null });
      } catch (error: unknown) {
        if (currentRequest === requestId)
          set({
            requestState: 'error',
            error:
              error instanceof Error
                ? error.message
                : 'Tickets could not be loaded. Try again.',
          });
      }
    },
    setSearchQuery: (searchQuery) =>
      set({ searchQuery: searchQuery.slice(0, 200) }),
    setStatusFilter: (statusFilter) => set({ statusFilter }),
    setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
    clearFilters: () => set(defaultFilters),
    selectTicket: (id) =>
      set({
        selectedTicketId:
          id === null || get().tickets.some((ticket) => ticket.id === id)
            ? id
            : null,
      }),
    updateTicketStatus: (id, status) =>
      updateTicket(id, { status }, `Status updated to ${status}`),
    updateTicketPriority: (id, priority) =>
      updateTicket(id, { priority }, `Priority updated to ${priority}`),
    setSort: (sortKey) =>
      set((state) => ({
        sortKey,
        sortDirection:
          state.sortKey === sortKey && state.sortDirection === 'desc'
            ? 'asc'
            : 'desc',
      })),
    dismissToast: () => set({ toast: null }),
  };
});

useTicketStore.subscribe((state, previous) => {
  if (
    state.searchQuery !== previous.searchQuery ||
    state.statusFilter !== previous.statusFilter ||
    state.priorityFilter !== previous.priorityFilter
  ) {
    saveFilters({
      searchQuery: state.searchQuery,
      statusFilter: state.statusFilter,
      priorityFilter: state.priorityFilter,
    });
  }
});

const priorityRank: Record<Priority, number> = { Low: 0, Medium: 1, High: 2 };
export function filteredTickets(
  state: Pick<
    TicketStore,
    | 'tickets'
    | 'searchQuery'
    | 'statusFilter'
    | 'priorityFilter'
    | 'sortKey'
    | 'sortDirection'
  >,
): Ticket[] {
  const query = state.searchQuery.trim().toLowerCase();
  return state.tickets
    .filter(
      (ticket) =>
        (state.statusFilter === 'All' ||
          ticket.status === state.statusFilter) &&
        (state.priorityFilter === 'All' ||
          ticket.priority === state.priorityFilter) &&
        `${ticket.customerName} ${ticket.subject} ${ticket.id}`
          .toLowerCase()
          .includes(query),
    )
    .sort((a, b) => {
      const difference =
        state.sortKey === 'priority'
          ? priorityRank[a.priority] - priorityRank[b.priority]
          : Date.parse(a.createdAt) - Date.parse(b.createdAt);
      return difference === 0
        ? a.id.localeCompare(b.id)
        : difference * (state.sortDirection === 'asc' ? 1 : -1);
    });
}

export function stats(state: Pick<TicketStore, 'tickets'>): TicketStats {
  return state.tickets.reduce<TicketStats>(
    (counts, ticket) => {
      counts.total++;
      if (ticket.status === 'Open') counts.open++;
      else if (ticket.status === 'In Progress') counts.inProgress++;
      else counts.resolved++;
      return counts;
    },
    { total: 0, open: 0, inProgress: 0, resolved: 0 },
  );
}
