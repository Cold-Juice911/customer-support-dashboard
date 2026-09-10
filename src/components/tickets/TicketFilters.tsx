import { ListFilter, X } from 'lucide-react';
import { PRIORITIES, STATUSES, isPriority, isStatus } from '../../lib/types';
import { useTicketStore } from '../../store/ticketStore';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

export function TicketFilters() {
  const status = useTicketStore((state) => state.statusFilter);
  const priority = useTicketStore((state) => state.priorityFilter);
  const query = useTicketStore((state) => state.searchQuery);
  const setStatus = useTicketStore((state) => state.setStatusFilter);
  const setPriority = useTicketStore((state) => state.setPriorityFilter);
  const clear = useTicketStore((state) => state.clearFilters);
  const sortKey = useTicketStore((state) => state.sortKey);
  const sortDirection = useTicketStore((state) => state.sortDirection);
  const setSort = useTicketStore((state) => state.setSort);
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3 sm:px-5">
      <ListFilter
        size={16}
        aria-hidden="true"
        className="mr-1 hidden text-secondary sm:block"
      />
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(event) => {
          const value = event.target.value;
          if (value === 'All' || isStatus(value)) setStatus(value);
        }}
      >
        <option value="All">All statuses</option>
        {STATUSES.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </Select>
      <Select
        aria-label="Filter by priority"
        value={priority}
        onChange={(event) => {
          const value = event.target.value;
          if (value === 'All' || isPriority(value)) setPriority(value);
        }}
      >
        <option value="All">All priorities</option>
        {PRIORITIES.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </Select>
      {(status !== 'All' || priority !== 'All' || query) && (
        <Button variant="ghost" onClick={clear} className="gap-1 px-2 text-xs">
          <X size={14} />
          Clear filters
        </Button>
      )}
      <div className="ml-auto flex items-center gap-1 xl:hidden">
        <Select
          aria-label="Sort tickets"
          value={`${sortKey}:${sortDirection}`}
          onChange={(event) => {
            const [key, direction] = event.target.value.split(':');
            if (
              (key === 'priority' || key === 'createdAt') &&
              (direction === 'asc' || direction === 'desc')
            )
              setSort(key, direction);
          }}
          className="text-xs"
        >
          <option value="createdAt:desc">Newest first</option>
          <option value="createdAt:asc">Oldest first</option>
          <option value="priority:desc">High priority first</option>
          <option value="priority:asc">Low priority first</option>
        </Select>
      </div>
    </div>
  );
}
