import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useTicketStore } from '../../store/ticketStore';

export function SearchBar() {
  const query = useTicketStore((state) => state.searchQuery);
  const setQuery = useTicketStore((state) => state.setSearchQuery);
  const [input, setInput] = useState(query);
  const ref = useRef<HTMLInputElement>(null);
  const debounced = useDebouncedValue(input);
  useEffect(() => {
    setQuery(debounced);
  }, [debounced, setQuery]);
  useEffect(
    () =>
      useTicketStore.subscribe((state, previous) => {
        // A clear action must cancel input that has not reached the debounce yet.
        if (
          state.searchQuery !== previous.searchQuery ||
          state.filterResetVersion !== previous.filterResetVersion
        )
          setInput(state.searchQuery);
      }),
    [],
  );
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        event.key === '/' &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !document.querySelector('dialog[open]') &&
        !(
          target instanceof HTMLElement &&
          (target.isContentEditable ||
            ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
        )
      ) {
        event.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  return (
    <div role="search" className="relative w-full max-w-md">
      <Search
        aria-hidden="true"
        size={17}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
      />
      <input
        id="ticket-search"
        ref={ref}
        value={input}
        onChange={(event) => setInput(event.target.value)}
        maxLength={200}
        aria-label="Search tickets"
        placeholder="Search tickets…"
        className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-10 text-sm placeholder:text-secondary"
      />
      {input ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setInput('');
            setQuery('');
            ref.current?.focus();
          }}
          className="absolute right-1 top-1 inline-flex h-8 w-8 items-center justify-center rounded text-secondary hover:text-primary"
        >
          <X size={15} />
        </button>
      ) : (
        <kbd
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border px-1.5 text-xs text-secondary"
        >
          /
        </kbd>
      )}
    </div>
  );
}
