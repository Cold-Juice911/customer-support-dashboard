import { MessageSquare } from 'lucide-react';
import type { Ticket } from '../../lib/types';
import { cn, formatDate, relativeDate } from '../../lib/utils';
import { Avatar } from '../ui/Avatar';

export function ConversationThread({ ticket }: { ticket: Ticket }) {
  const messages = [...ticket.messages].sort(
    (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
  );
  return (
    <section aria-labelledby="conversation-heading">
      <h3
        id="conversation-heading"
        className="mb-5 flex items-center gap-2 text-sm font-semibold"
      >
        <MessageSquare size={16} className="text-secondary" />
        Conversation
        <span className="ml-1 text-xs font-normal text-secondary">
          {messages.length} {messages.length === 1 ? 'message' : 'messages'}
        </span>
      </h3>
      <ol className="space-y-5">
        {messages.map((message) => (
          <li key={message.id} className="flex gap-3">
            <Avatar
              name={
                message.author === 'agent'
                  ? 'Support Agent'
                  : ticket.customerName
              }
              small
            />
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm font-medium">
                  {message.author === 'agent'
                    ? 'Support agent'
                    : ticket.customerName}
                </span>
                {message.author === 'agent' && (
                  <span className="rounded border border-border px-1.5 text-xs text-secondary">
                    Team
                  </span>
                )}
                <time
                  dateTime={message.timestamp}
                  title={formatDate(message.timestamp, 'PPpp')}
                  className="ml-auto text-xs text-secondary"
                >
                  {relativeDate(message.timestamp)}
                </time>
              </div>
              <p
                className={cn(
                  'whitespace-pre-wrap break-words rounded-lg border border-border p-3.5 text-sm leading-6',
                  message.author === 'agent' ? 'bg-subtle' : 'bg-surface',
                )}
              >
                {message.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
