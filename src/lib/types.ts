export const STATUSES = ['Open', 'In Progress', 'Resolved'] as const;
export const PRIORITIES = ['Low', 'Medium', 'High'] as const;
export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type StatusFilter = Status | 'All';
export type PriorityFilter = Priority | 'All';
export type RequestState = 'idle' | 'loading' | 'success' | 'error';
export type DemoMode = 'normal' | 'error' | 'empty';
export type SortKey = 'createdAt' | 'priority';
export type SortDirection = 'asc' | 'desc';

export interface Message {
  id: string;
  author: 'customer' | 'agent';
  body: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  customerName: string;
  customerEmail: string;
  company: string;
  subject: string;
  description: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

export function isStatus(value: unknown): value is Status {
  return STATUSES.some((status) => status === value);
}

export function isPriority(value: unknown): value is Priority {
  return PRIORITIES.some((priority) => priority === value);
}
