import { Circle, CircleCheck, CircleDashed } from 'lucide-react';
import type { Status } from '../../lib/types';
import { cn } from '../../lib/utils';

const icons = {
  Open: Circle,
  'In Progress': CircleDashed,
  Resolved: CircleCheck,
};
export function StatusBadge({ status }: { status: Status }) {
  const Icon = icons[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-xs font-medium',
        status === 'Open'
          ? 'border-open/20 bg-open/5 text-open'
          : status === 'In Progress'
            ? 'border-progress/20 bg-progress/5 text-progress'
            : 'border-resolved/20 bg-resolved/5 text-resolved',
      )}
    >
      <Icon size={12} aria-hidden="true" />
      {status}
    </span>
  );
}
