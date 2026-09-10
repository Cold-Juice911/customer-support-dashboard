import { ChevronRight } from 'lucide-react';
import type { Ticket } from '../../lib/types';
import { formatDate, relativeDate } from '../../lib/utils';
import { useTicketStore } from '../../store/ticketStore';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge } from './PriorityBadge';
import { StatusSelect } from './StatusSelect';

export function TicketCard({ ticket }: { ticket: Ticket }) {
  const select = useTicketStore((state) => state.selectTicket);
  return (
    <li className="p-4">
      <div className="mb-3 flex items-center gap-2.5">
        <Avatar name={ticket.customerName} small />
        <span className="text-sm font-medium">{ticket.customerName}</span>
        <time
          dateTime={ticket.createdAt}
          title={formatDate(ticket.createdAt, 'PPpp')}
          className="ml-auto text-xs text-secondary"
        >
          {formatDate(ticket.createdAt, 'MMM d')}
        </time>
      </div>
      <button
        type="button"
        onClick={() => select(ticket.id)}
        className="block w-full rounded text-left"
      >
        <span className="mb-1 block font-mono text-xs text-secondary">
          #{ticket.id}
        </span>
        <span className="flex items-center justify-between gap-3 text-sm font-medium leading-6">
          {ticket.subject}
          <ChevronRight
            size={16}
            aria-hidden="true"
            className="shrink-0 text-secondary"
          />
        </span>
      </button>
      <div className="mt-3 flex items-center justify-between gap-2">
        <PriorityBadge priority={ticket.priority} />
        <StatusSelect ticket={ticket} />
      </div>
      <span className="sr-only">Created {relativeDate(ticket.createdAt)}</span>
    </li>
  );
}
