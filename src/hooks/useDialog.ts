import { useCallback, useEffect, useRef, useState } from 'react';

export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef<number>();
  const [closing, setClosing] = useState(false);
  const close = useCallback(() => {
    if (closeTimer.current !== undefined) return;
    setClosing(true);
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : 200;
    closeTimer.current = window.setTimeout(() => {
      ref.current?.close();
      onClose();
      closeTimer.current = undefined;
      setClosing(false);
    }, delay);
  }, [onClose]);
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const trigger = document.activeElement;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const controls = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls.at(-1);
      if (!first || !last) {
        event.preventDefault();
        return;
      }
      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', trapFocus);
    return () => {
      document.removeEventListener('keydown', trapFocus);
      window.clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected)
        trigger.focus({ preventScroll: true });
      else document.querySelector<HTMLInputElement>('#ticket-search')?.focus();
    };
  }, [open]);
  return { ref, closing, close };
}
