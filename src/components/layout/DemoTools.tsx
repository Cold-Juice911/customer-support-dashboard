import { FlaskConical, RotateCcw } from 'lucide-react';
import { useTicketStore } from '../../store/ticketStore';
import { Button } from '../ui/Button';

export function DemoTools() {
  const fetchTickets = useTicketStore((state) => state.fetchTickets);
  const loading = useTicketStore((state) => state.requestState === 'loading');
  return (
    <details className="group text-xs text-secondary">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded p-1 hover:text-primary">
        <FlaskConical size={14} aria-hidden="true" />
        Demo controls
      </summary>
      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-3">
        <p className="w-full text-xs leading-5">
          Preview loading, error, and empty states. Loading sample tickets
          restores the original data.
        </p>
        <Button
          disabled={loading}
          onClick={() => void fetchTickets('error')}
          className="text-xs"
        >
          Simulate error
        </Button>
        <Button
          disabled={loading}
          onClick={() => void fetchTickets('empty')}
          className="text-xs"
        >
          Show empty workspace
        </Button>
        <Button
          disabled={loading}
          onClick={() => void fetchTickets()}
          className="text-xs"
        >
          <RotateCcw size={13} />
          Load sample tickets
        </Button>
      </div>
    </details>
  );
}
