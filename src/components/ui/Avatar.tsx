import { initials, cn } from '../../lib/utils';

export function Avatar({
  name,
  small = false,
}: {
  name: string;
  small?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-subtle font-semibold text-secondary',
        small ? 'h-8 w-8 text-xs' : 'h-9 w-9 text-xs',
      )}
    >
      {initials(name)}
    </span>
  );
}
