import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, X } from 'lucide-react';
import { useTicketStore } from '../../store/ticketStore';
import { Button } from './Button';
import { cn } from '../../lib/utils';

export function Toast() {
  const toast = useTicketStore((state) => state.toast);
  const dismiss = useTicketStore((state) => state.dismissToast);
  const selectedTicketId = useTicketStore((state) => state.selectedTicketId);
  const dialog = selectedTicketId
    ? document.getElementById('ticket-detail-panel')
    : null;
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(dismiss, 4500);
    return () => window.clearTimeout(timeout);
  }, [toast, dismiss]);
  const notification = (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        'pointer-events-none left-4 right-4 z-50 flex justify-center sm:left-auto sm:right-6',
        dialog ? 'absolute bottom-20' : 'fixed bottom-5',
      )}
    >
      {toast && (
        <div className="pointer-events-auto flex max-w-full items-center gap-3 rounded-lg border border-border bg-surface py-2 pl-4 pr-1.5 text-sm shadow-float">
          <CheckCircle2 size={18} className="shrink-0 text-resolved" />
          <span>{toast.message}</span>
          <Button
            variant="ghost"
            aria-label="Dismiss notification"
            onClick={dismiss}
            className="shrink-0 px-2"
          >
            <X size={16} />
          </Button>
        </div>
      )}
    </div>
  );
  return dialog ? createPortal(notification, dialog) : notification;
}
