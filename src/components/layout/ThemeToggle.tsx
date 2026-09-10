import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';

export function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  );
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      try {
        if (localStorage.getItem('support-theme')) return;
      } catch {
        /* Fall back to the system preference. */
      }
      document.documentElement.classList.toggle('dark', media.matches);
      setDark(media.matches);
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('support-theme', next ? 'dark' : 'light');
    } catch {
      /* The current theme still works without storage. */
    }
  }
  return (
    <Button
      variant="ghost"
      onClick={toggle}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      title={`Switch to ${dark ? 'light' : 'dark'} mode`}
      className="h-10 w-10 shrink-0 px-0"
    >
      {dark ? <Sun size={19} /> : <Moon size={19} />}
    </Button>
  );
}
