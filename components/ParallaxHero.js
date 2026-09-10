'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxHero({ locale, dict }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0.85]);

  return (
    <section ref={ref} className="relative bg-charcoal text-paper overflow-hidden">
      <motion.img
        src="/hero-storefront.jpg"
        alt=""
        style={{ y }}
        className="absolute inset-0 w-full h-[130%] object-cover"
      />
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/40"
      />
      <div className="relative max-w-6xl mx-auto px-5 pt-24 pb-32 md:pt-32 md:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="eyebrow text-ochre mb-4"
          >
            {dict.hero.eyebrow}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-4xl md:text-5xl font-bold leading-[1.1] mb-5"
          >
            {dict.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-paper/70 mb-8 max-w-md"
          >
            {dict.hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-3 flex-wrap"
          >
            <Link href={`/${locale}/urunler`} className="bg-brick hover:bg-brickdark transition-colors px-5 py-3 rounded font-medium text-sm text-charcoal">
              {dict.hero.cta}
            </Link>
            <Link href={`/${locale}/iletisim`} className="border border-paper/30 hover:border-paper transition-colors px-5 py-3 rounded font-medium text-sm">
              {dict.hero.ctaSecondary}
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <a
        href="#stats"
        className="relative flex flex-col items-center gap-2 pb-8 text-xs text-paper/70 hover:text-paper transition-colors w-fit mx-auto"
      >
        {dict.hero.scrollCue}
        <span className="w-6 h-9 rounded-full border border-paper/40 flex items-start justify-center p-1.5">
          <span className="w-1 h-1.5 rounded-full bg-paper animate-bounce" />
        </span>
      </a>
    </section>
  );
}
