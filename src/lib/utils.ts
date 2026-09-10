import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNowStrict, isValid, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDate(value: string, pattern = 'MMM d, yyyy') {
  const date = parseISO(value);
  return isValid(date) ? format(date, pattern) : 'Date unavailable';
}
export function relativeDate(value: string) {
  const date = parseISO(value);
  return isValid(date)
    ? formatDistanceToNowStrict(date, { addSuffix: true })
    : 'Date unavailable';
}
export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}
