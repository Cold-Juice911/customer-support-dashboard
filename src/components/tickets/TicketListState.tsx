import { Inbox, SearchX } from 'lucide-react';
import { useTicketStore } from '../../store/ticketStore';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';

export function TicketListSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading tickets"
      className="divide-y divide-border"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-6">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="w-1/4 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="hidden h-7 w-24 sm:block" />
        </div>
      ))}
    </div>
  );
}

export function TicketEmptyState({ filtered }: { filtered: boolean }) {
  const clear = useTicketStore((state) => state.clearFilters);
  const Icon = filtered ? SearchX : Inbox;
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background">
        <Icon size={23} className="text-secondary" />
      </span>
      <h3 className="text-base font-semibold">
        {filtered ? 'No tickets match your filters' : 'No tickets yet'}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-secondary">
        {filtered
          ? 'Try another search or clear your filters to see all tickets.'
          : 'New customer conversations will appear here when they arrive.'}
      </p>
      {filtered && (
        <Button onClick={clear} className="mt-5">
          Clear filters
        </Button>
      )}
    </div>
  );
}
