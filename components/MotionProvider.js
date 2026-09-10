'use client';

import { MotionConfig } from 'framer-motion';

// Respects the OS-level "reduce motion" accessibility setting for every
// framer-motion animation in the app (parallax, reveals, counters).
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
