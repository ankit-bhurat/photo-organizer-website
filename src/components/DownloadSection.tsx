import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Platform = 'mac-silicon' | 'mac-intel' | 'windows' | 'linux';

interface PlatformInfo {
  id: Platform;
  name: string;
  chip: string;
  label: string;
  icon: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Platform data                                                      */
/* ------------------------------------------------------------------ */

const platforms: PlatformInfo[] = [
  {
    id: 'mac-silicon',
    name: 'Mac',
    chip: 'Apple Silicon',
    label: 'Mac (Apple Silicon)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    id: 'mac-intel',
    name: 'Mac',
    chip: 'Intel',
    label: 'Mac (Intel)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    id: 'windows',
    name: 'Windows',
    chip: 'x86_64',
    label: 'Windows',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .08V5.67L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91V13.1l10 .15z" />
      </svg>
    ),
  },
  {
    id: 'linux',
    name: 'Linux',
    chip: 'x86_64 / ARM',
    label: 'Linux',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.368 1.884 1.43.868.074 1.741-.26 2.151-.67.44-.44.727-.86.93-1.118.185-.227.39-.333.6-.467.22-.135.465-.268.69-.498.113-.115.185-.253.248-.366.136-.085.29-.135.45-.135.36 0 .636-.198.968-.467.33-.268.72-.667.95-1.2.06-.136.054-.334-.013-.47a.59.59 0 00-.378-.282c-.108-.027-.227-.027-.34.013-.113.04-.225.081-.336.131-.2.09-.37.213-.53.3-.16.09-.325.148-.396.148-.076 0-.22-.108-.413-.267-.192-.16-.447-.4-.7-.601-.502-.4-1.102-.867-1.7-.867-.16 0-.317.025-.455.108-.198.117-.358.339-.492.555-.302-.108-.648-.268-.96-.401a1.634 1.634 0 00-.073-.152 6.078 6.078 0 00-.237-.397 5.44 5.44 0 01-.235-.395c.06-.135.073-.253.073-.37 0-.26-.131-.517-.264-.675-.097-.12-.25-.226-.379-.333.173-.685.137-1.444-.128-2.234-.157-.467-.35-.904-.5-1.247-.07-.158-.04-.276.053-.44.097-.172.245-.373.373-.605.29-.527.503-1.218.36-2.128-.074-.467-.277-1.014-.571-1.466a2.75 2.75 0 00-.396-.463c-.022-.2-.073-.4-.154-.599-.097-.24-.295-.44-.524-.598a5.18 5.18 0 00-.451-.23 7.637 7.637 0 00-.538-.21c-.26-.088-.442-.075-.56-.021l-.07.048a.43.43 0 00-.264-.07c-.128 0-.262.015-.39.065-.196.079-.362.23-.484.408-.122.178-.21.39-.263.609a2.834 2.834 0 00-.048.525c-.089-.003-.176.006-.27.006-.37 0-.795-.06-1.178-.155a5.04 5.04 0 01-.614-.197c-.21-.088-.352-.194-.436-.294a.447.447 0 00-.353-.17z" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  What to expect items                                               */
/* ------------------------------------------------------------------ */

const expectations = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: 'AI-powered photo search',
    description: 'Find any photo by describing it in plain language. Runs 100% on your device.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Fully private, no cloud',
    description: 'Your photos never leave your device. No uploads, no tracking, no third-party access.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Native performance',
    description: 'Built for speed on every platform. Indexes thousands of photos in seconds.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    title: 'One-time purchase',
    description: 'Pay once, own it forever. No subscriptions or recurring fees.',
  },
];

/* ------------------------------------------------------------------ */
/*  Platform detail panel (replaces old download + install steps)       */
/* ------------------------------------------------------------------ */

function PlatformDetail({ platform }: { platform: PlatformInfo }) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    if (!panelRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }, panelRef);
    return () => ctx.revert();
  }, [platform.id]);

  return (
    <div ref={panelRef} className="mt-10">
      {/* Coming soon message + waitlist CTA */}
      <div className="max-w-xl mx-auto text-center">
        <div className="download-coming-soon-card relative p-1 rounded-2xl bg-gradient-to-b from-brand-500/20 via-surface-800/30 to-surface-800/20">
          <div className="download-coming-soon-inner bg-surface-950 rounded-[14px] p-8 sm:p-10">
            {/* Bell icon */}
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
              {platform.label} version is coming soon
            </h3>
            <p className="text-surface-300 text-[15px] mb-6">
              We'll notify you as soon as the {platform.label} version is ready to download. Be among the first to try it.
            </p>

            <a
              href="/waitlist"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-600 text-white font-semibold text-[15px] hover:bg-brand-500 active:bg-brand-700 transition-all duration-200 shadow-lg shadow-brand-600/25 hover:shadow-brand-500/35 hover:scale-[1.02] active:scale-[0.98]"
            >
              Join the Waitlist
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            <p className="text-xs text-surface-400 mt-5 flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-surface-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              No spam. We'll only email you when it launches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main DownloadSection component                                     */
/* ------------------------------------------------------------------ */

export default function DownloadSection() {
  const [selected, setSelected] = useState<Platform | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // GSAP entrance animation for cards
  useEffect(() => {
    if (!cardsRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const cards = cardsRef.current.querySelectorAll('.platform-card');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }, cardsRef);
    return () => ctx.revert();
  }, []);

  // Card selection animation
  const handleSelect = useCallback((platformId: Platform) => {
    setSelected(platformId);
    if (!cardsRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const cards = cardsRef.current.querySelectorAll('.platform-card');
    cards.forEach((card) => {
      const id = card.getAttribute('data-platform');
      if (id === platformId) {
        gsap.to(card, {
          scale: 1.04,
          duration: 0.25,
          ease: 'back.out(3)',
          onComplete: () => {
            gsap.to(card, { scale: 1, duration: 0.2, ease: 'power2.out' });
          },
        });
      } else {
        gsap.to(card, { scale: 0.97, opacity: 0.55, duration: 0.3, ease: 'power2.out' });
      }
    });
  }, []);

  // Reset card states when deselecting
  const handleDeselect = useCallback(() => {
    setSelected(null);
    if (!cardsRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const cards = cardsRef.current.querySelectorAll('.platform-card');
    gsap.to(cards, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' });
  }, []);

  const selectedPlatform = platforms.find((p) => p.id === selected) ?? null;

  return (
    <div className="container-wide">
      {/* Platform selection cards */}
      <div
        ref={cardsRef}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
      >
        {platforms.map((p) => {
          const isSelected = selected === p.id;
          return (
            <button
              key={p.id}
              data-platform={p.id}
              onClick={() => (isSelected ? handleDeselect() : handleSelect(p.id))}
              className={`platform-card relative flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl border backdrop-blur-sm cursor-pointer transition-all duration-300 group ${
                isSelected
                  ? 'bg-surface-900/70 border-brand-500 shadow-lg shadow-brand-500/10'
                  : 'bg-surface-900/50 border-surface-800/60 hover:border-surface-700/80 hover:bg-surface-900/70'
              }`}
            >
              {/* Glow effect on selection */}
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl bg-brand-500/5 pointer-events-none" />
              )}

              {/* Icon */}
              <div className={`transition-colors duration-300 ${
                isSelected ? 'text-brand-400' : 'text-surface-400 group-hover:text-surface-200'
              }`}>
                {p.icon}
              </div>

              {/* Platform name */}
              <div className="text-center">
                <div className={`font-semibold transition-colors duration-300 ${
                  isSelected ? 'text-white' : 'text-surface-200 group-hover:text-white'
                }`}>
                  {p.name}
                </div>
                <div className={`text-xs mt-1 font-mono transition-colors duration-300 ${
                  isSelected ? 'text-brand-400' : 'text-surface-500'
                }`}>
                  {p.chip}
                </div>
              </div>

              {/* Coming soon badge */}
              <div className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors duration-300 ${
                isSelected
                  ? 'bg-brand-500/15 text-brand-300'
                  : 'bg-surface-800/60 text-surface-500'
              }`}>
                Coming soon
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shadow-md shadow-brand-500/30">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Platform detail panel */}
      {selectedPlatform && (
        <PlatformDetail key={selectedPlatform.id} platform={selectedPlatform} />
      )}

      {/* Hint text when nothing is selected */}
      {!selected && (
        <p className="text-center text-surface-400 text-sm mt-8 animate-pulse">
          Select your platform to get notified when it's available
        </p>
      )}

      {/* What to expect section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-surface-400 text-center mb-8">What to expect</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {expectations.map((item, i) => (
            <div
              key={i}
              className="download-expect-card flex items-start gap-4 p-5 rounded-xl bg-surface-900/40 border border-surface-800/40"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                {item.icon}
              </div>
              <div>
                <h3 className="font-medium text-white text-[15px] mb-1">{item.title}</h3>
                <p className="text-sm text-surface-300 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System requirements note */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-900/50 border border-surface-800/40">
          <svg className="w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span className="text-xs text-surface-400">
            Requires 4 GB RAM, 500 MB disk space. macOS 12+, Windows 10+, or Ubuntu 20.04+
          </span>
        </div>
      </div>
    </div>
  );
}
