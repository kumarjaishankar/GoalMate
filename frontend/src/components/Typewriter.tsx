import { useEffect, useMemo, useRef, useState } from 'react';

interface TypewriterProps {
  words: string[];
  typingSpeedMs?: number;
  deletingSpeedMs?: number;
  holdMs?: number;
  className?: string;
}

export const Typewriter = ({
  words,
  typingSpeedMs = 80,
  deletingSpeedMs = 45,
  holdMs = 900,
  className = ''
}: TypewriterProps) => {
  const safeWords = useMemo(() => (words && words.length ? words : ['companion']), [words]);
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState('');
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const current = safeWords[index % safeWords.length];

    const tick = () => {
      if (!deleting) {
        if (display.length < current.length) {
          setDisplay(current.slice(0, display.length + 1));
          timeoutRef.current = window.setTimeout(tick, typingSpeedMs);
        } else {
          timeoutRef.current = window.setTimeout(() => setDeleting(true), holdMs);
        }
      } else {
        if (display.length > 0) {
          setDisplay(current.slice(0, display.length - 1));
          timeoutRef.current = window.setTimeout(tick, deletingSpeedMs);
        } else {
          setDeleting(false);
          setIndex((i) => (i + 1) % safeWords.length);
          timeoutRef.current = window.setTimeout(tick, typingSpeedMs);
        }
      }
    };

    timeoutRef.current = window.setTimeout(tick, typingSpeedMs);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [safeWords, index, display, deleting, typingSpeedMs, deletingSpeedMs, holdMs]);

  return (
    <span className={className} aria-live="polite">
      {display}
      <span className="border-r-2 border-foreground/80 ml-1 animate-pulse" aria-hidden>
        {' '}
      </span>
    </span>
  );
};
