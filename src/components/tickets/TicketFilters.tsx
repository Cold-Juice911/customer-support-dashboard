import { ListFilter, X } from 'lucide-react';
import { PRIORITIES, STATUSES, isPriority, isStatus } from '../../lib/types';
import { useTicketStore } from '../../store/ticketStore';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';

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
      <Dropdown
        aria-label="Filter by status"
        containerClassName="w-full sm:w-[150px]"
        value={status}
        onChange={(value) => {
          if (value === 'All' || isStatus(value)) setStatus(value);
        }}
        options={[
          { value: 'All', label: 'All statuses' },
          ...STATUSES.map((item) => ({ value: item, label: item })),
        ]}
      />
      <Dropdown
        aria-label="Filter by priority"
        containerClassName="w-full sm:w-[150px]"
        value={priority}
        onChange={(value) => {
          if (value === 'All' || isPriority(value)) setPriority(value);
        }}
        options={[
          { value: 'All', label: 'All priorities' },
          ...PRIORITIES.map((item) => ({ value: item, label: item })),
        ]}
      />
      <Dropdown
        aria-label="Sort tickets"
        containerClassName="w-full sm:w-[150px]"
        value={`${sortKey}:${sortDirection}`}
        onChange={(value) => {
          const [key, direction] = value.split(':');
          if (
            (key === 'priority' || key === 'createdAt') &&
            (direction === 'asc' || direction === 'desc')
          )
            setSort(key, direction);
        }}
        options={[
          { value: 'createdAt:desc', label: 'Newest first' },
          { value: 'createdAt:asc', label: 'Oldest first' },
          { value: 'priority:desc', label: 'High priority' },
          { value: 'priority:asc', label: 'Low priority' },
        ]}
      />
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
