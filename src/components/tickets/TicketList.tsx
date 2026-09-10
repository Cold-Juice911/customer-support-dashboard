import { AlertCircle, RotateCcw } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { filteredTickets, useTicketStore } from '../../store/ticketStore';
import { Button } from '../ui/Button';
import { TicketFilters } from './TicketFilters';
import { TicketTable } from './TicketTable';
import { TicketEmptyState, TicketListSkeleton } from './TicketListState';

export function TicketList() {
  const tickets = useTicketStore(useShallow(filteredTickets));
  const total = useTicketStore((state) => state.tickets.length);
  const requestState = useTicketStore((state) => state.requestState);
  const error = useTicketStore((state) => state.error);
  const fetchTickets = useTicketStore((state) => state.fetchTickets);
  const loading = requestState === 'loading' || requestState === 'idle';
  return (
    <section
      aria-labelledby="ticket-list-heading"
      className="mt-7 overflow-hidden rounded-xl border border-border bg-surface"
    >
      <div className="flex flex-wrap items-center gap-2.5 px-4 py-5 sm:px-5">
        <h2 id="ticket-list-heading" className="text-base font-semibold">
          Your tickets
        </h2>
        <span className="rounded-md border border-border bg-background px-2 py-0.5 text-xs font-medium tabular-nums text-secondary">
          {loading ? '…' : tickets.length}
        </span>
        <p className="ml-auto hidden text-xs text-secondary md:block">
          A clear view of every conversation
        </p>
      </div>
      <TicketFilters />
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 border-b border-border bg-high/5 px-5 py-4"
        >
          <AlertCircle className="shrink-0 text-high" size={20} />
          <p className="min-w-40 flex-1 text-sm leading-6">{error}</p>
          <Button onClick={() => void fetchTickets()}>
            <RotateCcw size={14} />
            Retry
          </Button>
        </div>
      )}
      {loading ? (
        <TicketListSkeleton />
      ) : tickets.length > 0 ? (
        <TicketTable tickets={tickets} />
      ) : requestState !== 'error' ? (
        <TicketEmptyState filtered={total > 0} />
      ) : (
        <div className="px-5 py-14 text-center text-sm text-secondary">
          Your workspace is ready. Retry to load your tickets.
        </div>
      )}
      <footer className="flex items-center justify-between gap-2 border-t border-border px-4 py-4 text-xs text-secondary sm:px-5">
        <p role="status" aria-live="polite">
          {loading
            ? 'Loading tickets…'
            : `Showing ${tickets.length} of ${total} tickets`}
        </p>
        <span className="hidden sm:inline">
          Select a subject to open details
        </span>
      </footer>
    </section>
  );
}
