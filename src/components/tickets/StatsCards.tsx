import {
  ArrowUpRight,
  Circle,
  CircleCheck,
  CircleDashed,
  Inbox,
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { stats, useTicketStore } from '../../store/ticketStore';
import type { StatusFilter } from '../../lib/types';
import { cn } from '../../lib/utils';
import { Skeleton } from '../ui/Skeleton';

export function StatsCards() {
  const counts = useTicketStore(useShallow(stats));
  const loading = useTicketStore(
    (state) =>
      state.requestState === 'loading' || state.requestState === 'idle',
  );
  const active = useTicketStore((state) => state.statusFilter);
  const setFilter = useTicketStore((state) => state.setStatusFilter);
  const cards = [
    {
      label: 'Total Tickets',
      value: counts.total,
      filter: 'All',
      icon: Inbox,
      tone: 'text-secondary',
      caption: 'Across your workspace',
    },
    {
      label: 'Open',
      value: counts.open,
      filter: 'Open',
      icon: Circle,
      tone: 'text-open',
      caption: 'Ready for a first response',
    },
    {
      label: 'In Progress',
      value: counts.inProgress,
      filter: 'In Progress',
      icon: CircleDashed,
      tone: 'text-progress',
      caption: 'Getting closer to a solution',
    },
    {
      label: 'Resolved',
      value: counts.resolved,
      filter: 'Resolved',
      icon: CircleCheck,
      tone: 'text-resolved',
      caption: 'Taken care of',
    },
  ] satisfies {
    label: string;
    value: number;
    filter: StatusFilter;
    icon: typeof Inbox;
    tone: string;
    caption: string;
  }[];
  return (
    <section
      aria-label="Ticket statistics"
      aria-busy={loading}
      className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
    >
      {cards.map(({ label, value, filter, icon: Icon, tone, caption }) => (
        <button
          type="button"
          key={label}
          disabled={loading}
          aria-pressed={active === filter}
          onClick={() => setFilter(filter)}
          className={cn(
            'group rounded-[10px] border bg-surface p-4 text-left transition-colors sm:p-5',
            active === filter
              ? 'border-accent/50'
              : 'border-border hover:border-secondary/40',
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-secondary sm:text-sm">
              {label}
            </span>
            <Icon aria-hidden="true" size={17} className={tone} />
          </div>
          {loading ? (
            <Skeleton className="my-3 h-9 w-12" />
          ) : (
            <div className="my-2.5 flex items-center justify-between">
              <span
                data-testid={`stat-${filter}`}
                className="text-[30px] font-semibold leading-10 tracking-tight tabular-nums"
              >
                {value}
              </span>
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="text-secondary opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              />
            </div>
          )}
          <p className="hidden text-xs text-secondary sm:block">{caption}</p>
        </button>
      ))}
    </section>
  );
}
