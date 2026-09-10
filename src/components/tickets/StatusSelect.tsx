import { STATUSES, isStatus, type Ticket } from '../../lib/types';
import { useTicketStore } from '../../store/ticketStore';
import { Select } from '../ui/Select';
import { cn } from '../../lib/utils';

export function StatusSelect({ ticket }: { ticket: Ticket }) {
  const updateStatus = useTicketStore((state) => state.updateTicketStatus);
  return (
    <Select
      aria-label={`Status for ${ticket.id}`}
      value={ticket.status}
      onChange={(event) => {
        const control = event.currentTarget;
        if (!isStatus(control.value)) return;
        updateStatus(ticket.id, control.value);
        requestAnimationFrame(() => {
          if (!control.isConnected)
            document.querySelector<HTMLInputElement>('#ticket-search')?.focus();
        });
      }}
      className={cn(
        'min-h-8 text-xs',
        ticket.status === 'Open'
          ? 'border-open/20 bg-open/5 text-open'
          : ticket.status === 'In Progress'
            ? 'border-progress/20 bg-progress/5 text-progress'
            : 'border-resolved/20 bg-resolved/5 text-resolved',
      )}
    >
      {STATUSES.map((status) => (
        <option key={status}>{status}</option>
      ))}
    </Select>
  );
}
