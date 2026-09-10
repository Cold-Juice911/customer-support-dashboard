import { SignalHigh, SignalLow, SignalMedium } from 'lucide-react';
import type { Priority } from '../../lib/types';
import { cn } from '../../lib/utils';

const icons = { Low: SignalLow, Medium: SignalMedium, High: SignalHigh };
export function PriorityBadge({ priority }: { priority: Priority }) {
  const Icon = icons[priority];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm">
      <Icon
        aria-hidden="true"
        size={17}
        className={cn(
          priority === 'High'
            ? 'text-high'
            : priority === 'Medium'
              ? 'text-progress'
              : 'text-resolved',
        )}
      />
      {priority}
    </span>
  );
}
