import { useCallback, useEffect, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DemoTools } from './components/layout/DemoTools';
import { StatsCards } from './components/tickets/StatsCards';
import { TicketList } from './components/tickets/TicketList';
import { TicketDetailPanel } from './components/tickets/TicketDetailPanel';
import { Toast } from './components/ui/Toast';
import { useTicketStore } from './store/ticketStore';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeNavigation = useCallback(() => setMobileOpen(false), []);
  const fetchTickets = useTicketStore((state) => state.fetchTickets);
  useEffect(() => {
    if (useTicketStore.getState().requestState !== 'idle') return;
    const demo = new URLSearchParams(window.location.search).get('demo');
    void fetchTickets(demo === 'error' || demo === 'empty' ? demo : 'normal');
  }, [fetchTickets]);
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to tickets
      </a>
      <Sidebar mobileOpen={mobileOpen} onClose={closeNavigation} />
      <div className="min-h-screen lg:pl-[236px]">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main
          id="main-content"
          className="mx-auto max-w-[1600px] px-4 pb-8 pt-7 sm:px-8 sm:pt-8"
        >
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <div className="mb-1.5 flex items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Support overview
                </h1>
                <span className="hidden rounded-md border border-border bg-surface px-2 py-1 text-xs text-secondary sm:inline">
                  Team inbox
                </span>
              </div>
              <p className="text-sm leading-6 text-secondary">
                Good support starts with a clear inbox.
              </p>
            </div>
            <div className="hidden text-right text-xs leading-5 text-secondary xl:block">
              <p>Customer support</p>
              <p className="font-medium text-primary">
                Your team’s shared workspace
              </p>
            </div>
          </div>
          <StatsCards />
          <TicketList />
          <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
            <DemoTools />
            <p className="pt-1 text-xs text-secondary">
              Sample data. Changes last for this session.
            </p>
          </div>
        </main>
      </div>
      <TicketDetailPanel />
      <Toast />
    </>
  );
}
