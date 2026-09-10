import { ChevronRight, Menu } from 'lucide-react';
import { SearchBar } from '../tickets/SearchBar';
import { Button } from '../ui/Button';
import { ThemeToggle } from './ThemeToggle';

export function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="flex min-h-[76px] items-center gap-3 border-b border-border bg-surface px-4 sm:px-8">
      <Button
        onClick={onMenu}
        aria-label="Open navigation"
        variant="ghost"
        className="px-1.5 lg:hidden"
      >
        <Menu size={21} />
      </Button>
      <div className="mr-auto hidden items-center gap-3 text-sm lg:flex">
        <span className="text-secondary">Workspace</span>
        <ChevronRight aria-hidden="true" size={14} className="text-secondary" />
        <span className="font-medium">Support</span>
      </div>
      <div className="flex w-full items-center justify-end gap-2 lg:w-[380px]">
        <SearchBar />
        <ThemeToggle />
      </div>
    </header>
  );
}
