import { CalendarDays, Mail } from 'lucide-react';
import {
  PRIORITIES,
  STATUSES,
  isPriority,
  isStatus,
  type Ticket,
} from '../../lib/types';
import { formatDate } from '../../lib/utils';
import { useTicketStore } from '../../store/ticketStore';
import { Avatar } from '../ui/Avatar';
import { Select } from '../ui/Select';

export function TicketProperties({ ticket }: { ticket: Ticket }) {
  const updateStatus = useTicketStore((state) => state.updateTicketStatus);
  const updatePriority = useTicketStore((state) => state.updateTicketPriority);
  return (
    <>
      <section
        aria-label="Customer information"
        className="rounded-lg border border-border bg-background p-4"
      >
        <div className="flex items-center gap-3">
          <Avatar name={ticket.customerName} />
          <div className="min-w-0">
            <p className="text-sm font-semibold">{ticket.customerName}</p>
            <p className="mt-0.5 text-xs text-secondary">{ticket.company}</p>
          </div>
        </div>
        <a
          href={`mailto:${ticket.customerEmail}`}
          className="mt-4 flex items-start gap-2 text-sm text-secondary hover:text-accent"
        >
          <Mail size={16} className="mt-0.5 shrink-0" />
          <span className="break-all">{ticket.customerEmail}</span>
        </a>
      </section>
      <dl className="my-6 grid grid-cols-2 gap-4">
        <div>
          <dt className="mb-2 text-xs font-medium text-secondary">Status</dt>
          <dd>
            <Select
              aria-label="Ticket status"
              value={ticket.status}
              onChange={(event) => {
                if (isStatus(event.target.value))
                  updateStatus(ticket.id, event.target.value);
              }}
            >
              {STATUSES.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </Select>
          </dd>
        </div>
        <div>
          <dt className="mb-2 text-xs font-medium text-secondary">Priority</dt>
          <dd>
            <Select
              aria-label="Ticket priority"
              value={ticket.priority}
              onChange={(event) => {
                if (isPriority(event.target.value))
                  updatePriority(ticket.id, event.target.value);
              }}
            >
              {PRIORITIES.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </Select>
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="mb-2 text-xs font-medium text-secondary">Created</dt>
          <dd className="flex items-center gap-2 text-sm">
            <CalendarDays
              aria-hidden="true"
              size={15}
              className="text-secondary"
            />
            <time dateTime={ticket.createdAt}>
              {formatDate(ticket.createdAt, 'MMMM d, yyyy, h:mm a')}
            </time>
          </dd>
        </div>
      </dl>
    </>
  );
}
