import {
  Circle,
  CircleCheck,
  CircleDashed,
  Inbox,
  MessageSquareText,
  X,
} from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '../../lib/utils';
import type { StatusFilter } from '../../lib/types';
import { stats, useTicketStore } from '../../store/ticketStore';
import { useDialog } from '../../hooks/useDialog';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const counts = useTicketStore(useShallow(stats));
  const filter = useTicketStore((state) => state.statusFilter);
  const setFilter = useTicketStore((state) => state.setStatusFilter);
  const items = [
    { name: 'All tickets', value: 'All', icon: Inbox, count: counts.total },
    { name: 'Open', value: 'Open', icon: Circle, count: counts.open },
    {
      name: 'In Progress',
      value: 'In Progress',
      icon: CircleDashed,
      count: counts.inProgress,
    },
    {
      name: 'Resolved',
      value: 'Resolved',
      icon: CircleCheck,
      count: counts.resolved,
    },
  ] satisfies {
    name: string;
    value: StatusFilter;
    icon: typeof Inbox;
    count: number;
  }[];
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[76px] shrink-0 items-center gap-2.5 border-b border-border px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent text-on-accent">
          <MessageSquareText size={21} strokeWidth={1.8} />
        </span>
        <span className="text-lg font-semibold tracking-tight">
          Support desk<span className="ml-1 text-accent">.</span>
        </span>
      </div>
      <div className="px-3 pt-8">
        <p className="mb-3 px-3 text-xs font-medium text-secondary">
          Workspace
        </p>
        <nav aria-label="Ticket navigation" className="space-y-1">
          {items.map(({ name, value, icon: Icon, count }) => (
            <button
              type="button"
              key={value}
              aria-current={filter === value ? 'page' : undefined}
              onClick={() => {
                setFilter(value);
                onNavigate?.();
              }}
              className={cn(
                'flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                filter === value
                  ? 'bg-subtle text-accent'
                  : 'text-secondary hover:bg-hover hover:text-primary',
              )}
            >
              <Icon aria-hidden="true" size={18} />
              <span>{name}</span>
              <span
                className={cn(
                  'ml-auto min-w-6 rounded px-1.5 py-0.5 text-xs tabular-nums',
                  filter === value
                    ? 'bg-surface text-accent'
                    : 'text-secondary',
                )}
              >
                {count}
              </span>
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-auto px-6 pb-6 pt-10">
        <div className="mb-5 border-l-2 border-border pl-3">
          <p className="text-xs font-medium">
            A little clarity. Better support.
          </p>
          <p className="mt-1 text-xs leading-5 text-secondary">
            Every conversation, in one place.
          </p>
        </div>
        <div className="flex items-center gap-2.5 border-t border-border pt-5">
          <Avatar name="Support Agent" />
          <div>
            <p className="text-sm font-medium">Support agent</p>
            <p className="mt-0.5 text-xs text-secondary">Demo workspace</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const closeNavigation = useCallback(onClose, [onClose]);
  const { ref, close } = useDialog(mobileOpen, closeNavigation);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1025px)');
    const handle = () => {
      if (media.matches && mobileOpen) close();
    };
    media.addEventListener('change', handle);
    return () => media.removeEventListener('change', handle);
  }, [mobileOpen, close]);
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[236px] border-r border-border bg-surface lg:block">
        <SidebarContent />
      </aside>
      <dialog
        ref={ref}
        aria-label="Navigation"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="navigation-dialog"
      >
        <div className="relative h-full">
          <SidebarContent onNavigate={close} />
          <Button
            onClick={close}
            aria-label="Close navigation"
            variant="ghost"
            className="absolute right-1 top-1 px-1"
          >
            <X size={15} />
          </Button>
        </div>
      </dialog>
    </>
  );
}
