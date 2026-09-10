'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

/**
 * Counts up from 0 to `value` once it scrolls into view. `value` should be
 * a plain number; `prefix`/`suffix` wrap the formatted result (e.g. suffix="+").
 */
export default function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1.6, format = true, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{format ? display.toLocaleString('tr-TR') : display}{suffix}
    </span>
  );
}
