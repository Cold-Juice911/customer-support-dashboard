import { createMockTickets } from './mockData';
import type { DemoMode, Ticket } from './types';

export async function fetchTickets(
  mode: DemoMode = 'normal',
): Promise<Ticket[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, 750));
  if (mode === 'error')
    throw new Error(
      'Tickets could not be loaded. Check your connection and try again.',
    );
  return mode === 'empty' ? [] : createMockTickets();
}
