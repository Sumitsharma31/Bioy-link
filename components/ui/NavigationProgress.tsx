'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * NavigationProgress
 * ------------------
 * Renders a slim animated progress bar at the very top of the viewport
 * whenever Next.js navigates between routes. Works purely off usePathname
 * change events — no external dependencies required.
 *
 * Strategy:
 *  - On pathname change → start the bar (animate from 0→80% quickly)
 *  - After a short tick  → complete it (80→100%) and fade out
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [completing, setCompleting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathRef = useRef(pathname);

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    // First render — no animation
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    // Reset & kick off the bar
    clear();
    setCompleting(false);
    setProgress(0);
    setVisible(true);

    // Ramp up quickly to 85%
    timerRef.current = setTimeout(() => {
      setProgress(85);

      // Complete after page has likely rendered
      timerRef.current = setTimeout(() => {
        setCompleting(true);
        setProgress(100);

        // Fade out after completion animation
        timerRef.current = setTimeout(() => {
          setVisible(false);
          setProgress(0);
          setCompleting(false);
        }, 400);
      }, 350);
    }, 10);

    return clear;
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      {/* Progress bar */}
      <div
        role="progressbar"
        aria-label="Page loading"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #d2e823, #a8c000, #d2e823)',
            backgroundSize: '200% 100%',
            transition: completing
              ? 'width 0.25s ease-out'
              : 'width 0.6s cubic-bezier(0.1, 0.8, 0.3, 1)',
            opacity: completing && progress === 100 ? 0 : 1,
            animation: 'shimmer 1.5s infinite linear',
            boxShadow: '0 0 6px rgba(210, 232, 35, 0.25), 0 0 12px rgba(210, 232, 35, 0.1)',
            borderRadius: '0 2px 2px 0',
          }}
        />
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}
