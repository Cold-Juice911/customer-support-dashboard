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
    <div className="grid grid-cols-2 items-center gap-2 border-b border-border px-4 py-3 sm:flex sm:flex-wrap sm:px-5">
      <ListFilter
        size={16}
        aria-hidden="true"
        className="mr-1 hidden text-secondary sm:block"
      />
      <Select
        aria-label="Filter by status"
        containerClassName="w-full sm:w-[150px]"
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
        containerClassName="w-full sm:w-[150px]"
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
      <Select
        aria-label="Sort tickets"
        containerClassName="w-full sm:w-[150px]"
        value={`${sortKey}:${sortDirection}`}
        onChange={(event) => {
          const [key, direction] = event.target.value.split(':');
          if (
            (key === 'priority' || key === 'createdAt') &&
            (direction === 'asc' || direction === 'desc')
          )
            setSort(key, direction);
        }}
      >
        <option value="createdAt:desc">Newest first</option>
        <option value="createdAt:asc">Oldest first</option>
        <option value="priority:desc">High priority</option>
        <option value="priority:asc">Low priority</option>
      </Select>
      {(status !== 'All' || priority !== 'All' || query) && (
        <Button
          variant="ghost"
          onClick={clear}
          className="justify-self-start gap-1 px-2 text-xs"
        >
          <X size={14} />
          Clear filters
        </Button>
      )}
    </div>
  );
}
