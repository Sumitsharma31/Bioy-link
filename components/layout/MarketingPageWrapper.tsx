'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MarketingPageWrapper
 * --------------------
 * Wraps marketing page children with a smooth fade + upward-slide
 * transition on every route change — identical feel to the dashboard.
 *
 * Rendered inside MarketingLayout (server component) so the Navbar
 * and Footer remain stable while only the page content animates.
 */
export default function MarketingPageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
