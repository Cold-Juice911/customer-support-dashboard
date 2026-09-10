import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { SortKey, Ticket } from '../../lib/types';
import { cn, formatDate, relativeDate } from '../../lib/utils';
import { useTicketStore } from '../../store/ticketStore';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge } from './PriorityBadge';
import { StatusSelect } from './StatusSelect';
import { TicketCard } from './TicketCard';

function SortHeading({
  label,
  column,
  className,
}: {
  label: string;
  column: SortKey;
  className?: string;
}) {
  const sortKey = useTicketStore((state) => state.sortKey);
  const direction = useTicketStore((state) => state.sortDirection);
  const setSort = useTicketStore((state) => state.setSort);
  const Icon =
    sortKey !== column
      ? ArrowUpDown
      : direction === 'asc'
        ? ArrowUp
        : ArrowDown;
  return (
    <th
      scope="col"
      aria-sort={
        sortKey === column
          ? direction === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none'
      }
      className={cn('px-4 py-3', className)}
    >
      <button
        type="button"
        onClick={() => setSort(column)}
        className="flex items-center gap-1.5 rounded text-xs font-medium hover:text-primary"
      >
        {label}
        <Icon size={13} aria-hidden="true" />
      </button>
    </th>
  );
}

export function TicketTable({ tickets }: { tickets: Ticket[] }) {
  const select = useTicketStore((state) => state.selectTicket);
  return (
    <>
      <div className="hidden sm:block">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <caption className="sr-only">
            Support tickets. Open a subject to view details or change status
            from the list.
          </caption>
          <colgroup>
            <col className="w-[26%] xl:w-[23%]" />
            <col className="w-[32%] xl:w-[36%]" />
            <col className="w-[15%] xl:w-[12%]" />
            <col className="w-[27%] xl:w-[17%]" />
            <col className="hidden w-[12%] xl:table-column" />
          </colgroup>
          <thead className="border-b border-border bg-background text-xs font-medium text-secondary">
            <tr>
              <th scope="col" className="py-3 pl-5 pr-4 font-medium">
                Customer
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Subject
              </th>
              <SortHeading column="priority" label="Priority" />
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <SortHeading
                column="createdAt"
                label="Created"
                className="hidden xl:table-cell"
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="group transition-colors hover:bg-hover"
              >
                <td className="py-[18px] pl-5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <span className="hidden min-[800px]:block">
                      <Avatar name={ticket.customerName} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {ticket.customerName}
                      </p>
                      <p className="mt-1 truncate text-xs text-secondary">
                        {ticket.company}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => select(ticket.id)}
                    className="w-full rounded text-left"
                  >
                    <span className="mb-1 block font-mono text-xs text-secondary">
                      #{ticket.id}
                    </span>
                    <span className="line-clamp-2 text-sm font-medium leading-5 group-hover:text-accent">
                      {ticket.subject}
                    </span>
                  </button>
                  <time
                    dateTime={ticket.createdAt}
                    className="mt-1 block text-xs text-secondary xl:hidden"
                  >
                    {formatDate(ticket.createdAt, 'MMM d')}
                  </time>
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusSelect ticket={ticket} />
                </td>
                <td className="hidden px-4 py-3 text-xs text-secondary xl:table-cell">
                  <time
                    dateTime={ticket.createdAt}
                    title={formatDate(ticket.createdAt, 'PPpp')}
                    className="whitespace-nowrap"
                  >
                    {formatDate(ticket.createdAt, 'MMM d, yyyy')}
                  </time>
                  <p className="mt-1 text-xs">
                    {relativeDate(ticket.createdAt)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul
        aria-label="Support tickets"
        className="divide-y divide-border sm:hidden"
      >
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </ul>
    </>
  );
}
