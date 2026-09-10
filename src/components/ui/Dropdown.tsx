import { ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { cn } from '../../lib/utils';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  'aria-label'?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  containerClassName?: string;
  className?: string;
  disabled?: boolean;
}

export function Dropdown({
  'aria-label': ariaLabel,
  options,
  value,
  onChange,
  containerClassName,
  className,
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const uniqueId = useId();
  const listboxId = `dropdown-listbox-${uniqueId}`;

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedLabel = selectedOption?.label ?? value;

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const toggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => {
      if (!prev) {
        const trigger = triggerRef.current;
        if (trigger) {
          const rect = trigger.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;

          const menuHeight = options.length * 36 + 8;
          setOpenUpward(spaceBelow < menuHeight && rect.top > spaceBelow);
        }

        const idx = options.findIndex((o) => o.value === value);
        setHighlightedIndex(idx >= 0 ? idx : 0);
      }
      return !prev;
    });
  }, [disabled, options, value]);

  const selectOption = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      close();
      triggerRef.current?.focus();
    },
    [onChange, close],
  );

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    function handleEscapeGlobal(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleEscapeGlobal);
    return () => document.removeEventListener('keydown', handleEscapeGlobal);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) return;
    const menu = menuRef.current;
    if (!menu) return;
    const items = menu.querySelectorAll<HTMLLIElement>('[role="option"]');
    items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, highlightedIndex]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          if (!isOpen) {
            toggle();
          } else {
            setHighlightedIndex((prev) =>
              prev < options.length - 1 ? prev + 1 : 0,
            );
          }
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          if (!isOpen) {
            toggle();
          } else {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : options.length - 1,
            );
          }
          break;
        }
        case 'Enter':
        case ' ': {
          event.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            const opt = options[highlightedIndex];
            if (opt) selectOption(opt.value);
          } else if (!isOpen) {
            toggle();
          }
          break;
        }
        case 'Home': {
          if (isOpen) {
            event.preventDefault();
            setHighlightedIndex(0);
          }
          break;
        }
        case 'End': {
          if (isOpen) {
            event.preventDefault();
            setHighlightedIndex(options.length - 1);
          }
          break;
        }
        case 'Tab': {
          if (isOpen) close();
          break;
        }
      }
    },
    [isOpen, highlightedIndex, options, toggle, selectOption, close],
  );

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex min-w-0', containerClassName)}
    >
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex min-h-9 w-full items-center justify-between gap-1 rounded-md border border-border bg-surface py-1.5 pl-3 pr-2.5 text-left text-sm font-medium text-primary transition-colors',
          'hover:bg-hover',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isOpen && 'ring-2 ring-accent/40 border-accent/60',
          className,
        )}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          aria-hidden="true"
          size={14}
          className={cn(
            'shrink-0 text-secondary transition-transform duration-150',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <ul
          ref={menuRef}
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className={cn(
            'absolute left-0 z-50 w-full min-w-[160px] overflow-auto rounded-lg border border-border bg-surface py-1 shadow-float',
            'dropdown-enter',
            openUpward ? 'bottom-full mb-1' : 'top-full mt-1',
          )}
          style={{ maxHeight: '240px' }}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                data-highlighted={isHighlighted || undefined}
                className={cn(
                  'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors select-none',
                  isHighlighted && 'bg-hover',
                  isSelected ? 'font-semibold text-accent' : 'text-primary',
                )}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onClick={() => selectOption(option.value)}
              >
                <Check
                  size={14}
                  className={cn(
                    'shrink-0 transition-opacity',
                    isSelected ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <span className="truncate">{option.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
