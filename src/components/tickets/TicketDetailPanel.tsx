import { Check, X } from 'lucide-react';
import { useCallback } from 'react';
import { useDialog } from '../../hooks/useDialog';
import { useTicketStore } from '../../store/ticketStore';
import { cn, formatDate } from '../../lib/utils';
import { Button } from '../ui/Button';
import { StatusBadge } from './StatusBadge';
import { TicketProperties } from './TicketProperties';
import { ConversationThread } from './ConversationThread';

export function TicketDetailPanel() {
  const ticket = useTicketStore((state) =>
    state.tickets.find((item) => item.id === state.selectedTicketId),
  );
  const select = useTicketStore((state) => state.selectTicket);
  const updateStatus = useTicketStore((state) => state.updateTicketStatus);
  const onClose = useCallback(() => select(null), [select]);
  const { ref, closing, close } = useDialog(Boolean(ticket), onClose);
  return (
    <dialog
      id="ticket-detail-panel"
      ref={ref}
      aria-modal="true"
      aria-labelledby="ticket-detail-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className={cn('ticket-dialog', closing && 'is-closing')}
    >
      {ticket && (
        <div className="flex h-full flex-col">
          <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-secondary">
                #{ticket.id}
              </span>
              <StatusBadge status={ticket.status} />
            </div>
            <Button
              onClick={close}
              variant="ghost"
              aria-label="Close ticket details"
              className="px-2"
            >
              <X size={20} />
            </Button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
            <h2
              id="ticket-detail-title"
              className="mb-6 text-xl font-semibold leading-8 tracking-tight"
            >
              {ticket.subject}
            </h2>
            <TicketProperties ticket={ticket} />
            <section
              aria-labelledby="issue-heading"
              className="mb-7 border-y border-border py-6"
            >
              <h3 id="issue-heading" className="mb-2 text-sm font-semibold">
                Issue details
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-6 text-secondary">
                {ticket.description}
              </p>
            </section>
            <ConversationThread ticket={ticket} />
          </div>
          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border bg-surface px-5 py-4 sm:px-7">
            <p className="text-xs text-secondary">
              Updated {formatDate(ticket.updatedAt, 'MMM d, h:mm a')}
            </p>
            <Button
              variant={ticket.status === 'Resolved' ? 'secondary' : 'primary'}
              onClick={() =>
                updateStatus(
                  ticket.id,
                  ticket.status === 'Resolved' ? 'Open' : 'Resolved',
                )
              }
            >
              {ticket.status !== 'Resolved' && <Check size={16} />}
              {ticket.status === 'Resolved' ? 'Reopen ticket' : 'Mark Resolved'}
            </Button>
          </footer>
        </div>
      )}
    </dialog>
  );
}
