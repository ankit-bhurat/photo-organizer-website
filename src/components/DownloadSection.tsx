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
  fileName: string;
  fileSize: string;
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
    fileName: 'Photo-Organizer-arm64.dmg',
    fileSize: '89 MB',
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
    fileName: 'Photo-Organizer-x64.dmg',
    fileSize: '94 MB',
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
    fileName: 'Photo-Organizer-Setup.exe',
    fileSize: '102 MB',
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
    fileName: 'Photo-Organizer.AppImage',
    fileSize: '91 MB',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.368 1.884 1.43.868.074 1.741-.26 2.151-.67.44-.44.727-.86.93-1.118.185-.227.39-.333.6-.467.22-.135.465-.268.69-.498.113-.115.185-.253.248-.366.136-.085.29-.135.45-.135.36 0 .636-.198.968-.467.33-.268.72-.667.95-1.2.06-.136.054-.334-.013-.47a.59.59 0 00-.378-.282c-.108-.027-.227-.027-.34.013-.113.04-.225.081-.336.131-.2.09-.37.213-.53.3-.16.09-.325.148-.396.148-.076 0-.22-.108-.413-.267-.192-.16-.447-.4-.7-.601-.502-.4-1.102-.867-1.7-.867-.16 0-.317.025-.455.108-.198.117-.358.339-.492.555-.302-.108-.648-.268-.96-.401a1.634 1.634 0 00-.073-.152 6.078 6.078 0 00-.237-.397 5.44 5.44 0 01-.235-.395c.06-.135.073-.253.073-.37 0-.26-.131-.517-.264-.675-.097-.12-.25-.226-.379-.333.173-.685.137-1.444-.128-2.234-.157-.467-.35-.904-.5-1.247-.07-.158-.04-.276.053-.44.097-.172.245-.373.373-.605.29-.527.503-1.218.36-2.128-.074-.467-.277-1.014-.571-1.466a2.75 2.75 0 00-.396-.463c-.022-.2-.073-.4-.154-.599-.097-.24-.295-.44-.524-.598a5.18 5.18 0 00-.451-.23 7.637 7.637 0 00-.538-.21c-.26-.088-.442-.075-.56-.021l-.07.048a.43.43 0 00-.264-.07c-.128 0-.262.015-.39.065-.196.079-.362.23-.484.408-.122.178-.21.39-.263.609a2.834 2.834 0 00-.048.525c-.089-.003-.176.006-.27.006-.37 0-.795-.06-1.178-.155a5.04 5.04 0 01-.614-.197c-.21-.088-.352-.194-.436-.294a.447.447 0 00-.353-.17z" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Installation steps per platform                                    */
/* ------------------------------------------------------------------ */

interface InstallStep {
  title: string;
  description: string;
}

const installSteps: Record<Platform, InstallStep[]> = {
  'mac-silicon': [
    { title: 'Download .dmg', description: 'Download Photo-Organizer-arm64.dmg' },
    { title: 'Open file', description: 'Double-click the downloaded .dmg file' },
    { title: 'Drag to Applications', description: 'Drag Photo Organizer into your Applications folder' },
    { title: 'Launch & enjoy', description: 'Open from Applications or Spotlight' },
  ],
  'mac-intel': [
    { title: 'Download .dmg', description: 'Download Photo-Organizer-x64.dmg' },
    { title: 'Open file', description: 'Double-click the downloaded .dmg file' },
    { title: 'Drag to Applications', description: 'Drag Photo Organizer into your Applications folder' },
    { title: 'Launch & enjoy', description: 'Open from Applications or Spotlight' },
  ],
  windows: [
    { title: 'Download installer', description: 'Download Photo-Organizer-Setup.exe' },
    { title: 'Run installer', description: 'Double-click the .exe and follow the wizard' },
    { title: 'Choose location', description: 'Pick an install directory (default is recommended)' },
    { title: 'Launch & enjoy', description: 'Open from Start Menu or Desktop shortcut' },
  ],
  linux: [
    { title: 'Download AppImage', description: 'Download Photo-Organizer.AppImage' },
    { title: 'Make executable', description: 'Run chmod +x Photo-Organizer.AppImage' },
    { title: 'Run the app', description: 'Double-click or run ./Photo-Organizer.AppImage' },
    { title: 'Optional: integrate', description: 'Use AppImageLauncher for desktop integration' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Mac install animation (SVG + GSAP)                                 */
/* ------------------------------------------------------------------ */

function MacInstallAnimation({ activeStep }: { activeStep: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(-1);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    // Only animate when step changes
    if (prevStepRef.current === activeStep) return;
    prevStepRef.current = activeStep;

    const ctx = gsap.context(() => {
      // Reset all step visuals
      gsap.set('.mac-step-visual', { opacity: 0, scale: 0.9 });
      // Show the active step visual
      const activeEl = el.querySelector(`.mac-step-${activeStep}`);
      if (activeEl) {
        gsap.to(activeEl, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' });
      }
    }, el);

    return () => ctx.revert();
  }, [activeStep]);

  return (
    <div ref={containerRef} className="relative w-full h-64 sm:h-72 flex items-center justify-center">
      {/* Step 0: Download animation */}
      <div className="mac-step-visual mac-step-0 absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 200 160" className="w-48 h-40 sm:w-56 sm:h-44">
          <defs>
            <linearGradient id="dl-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b93ff" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* Cloud shape */}
          <ellipse cx="100" cy="50" rx="50" ry="28" fill="none" stroke="url(#dl-grad)" strokeWidth="2" opacity="0.5" />
          <ellipse cx="70" cy="55" rx="30" ry="20" fill="none" stroke="url(#dl-grad)" strokeWidth="1.5" opacity="0.3" />
          <ellipse cx="130" cy="55" rx="30" ry="20" fill="none" stroke="url(#dl-grad)" strokeWidth="1.5" opacity="0.3" />
          {/* Arrow down */}
          <line x1="100" y1="65" x2="100" y2="120" stroke="url(#dl-grad)" strokeWidth="3" strokeLinecap="round">
            <animate attributeName="y2" values="90;120;90" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
          </line>
          <polyline points="85,105 100,125 115,105" fill="none" stroke="url(#dl-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <animate attributeName="transform" values="translate(0,0);translate(0,5);translate(0,0)" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
          </polyline>
          {/* Progress bar */}
          <rect x="50" y="140" width="100" height="6" rx="3" fill="#343544" />
          <rect x="50" y="140" width="0" height="6" rx="3" fill="url(#dl-grad)">
            <animate attributeName="width" values="0;100;0" dur="2.5s" repeatCount="indefinite" />
          </rect>
          {/* File name */}
          <text x="100" y="135" textAnchor="middle" fill="#878aa5" fontSize="8" fontFamily="Inter, sans-serif">.dmg</text>
        </svg>
      </div>

      {/* Step 1: Open DMG animation */}
      <div className="mac-step-visual mac-step-1 absolute inset-0 flex items-center justify-center opacity-0">
        <svg viewBox="0 0 200 160" className="w-48 h-40 sm:w-56 sm:h-44">
          <defs>
            <linearGradient id="dmg-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b93ff" />
              <stop offset="100%" stopColor="#1e6ff5" />
            </linearGradient>
          </defs>
          {/* DMG disk icon */}
          <rect x="55" y="25" width="90" height="70" rx="12" fill="none" stroke="url(#dmg-grad)" strokeWidth="2">
            <animate attributeName="rx" values="12;16;12" dur="2s" repeatCount="indefinite" />
          </rect>
          <rect x="55" y="25" width="90" height="70" rx="12" fill="#3b93ff" opacity="0.08">
            <animate attributeName="opacity" values="0.05;0.12;0.05" dur="2s" repeatCount="indefinite" />
          </rect>
          {/* Disk drive line */}
          <line x1="65" y1="75" x2="135" y2="75" stroke="#3b93ff" strokeWidth="1" opacity="0.3" />
          {/* Lens/icon inside */}
          <circle cx="100" cy="52" r="14" fill="none" stroke="url(#dmg-grad)" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="r" values="14;16;14" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="52" r="5" fill="#3b93ff" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Opening effect - expanding rings */}
          <circle cx="100" cy="52" r="20" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0">
            <animate attributeName="r" values="20;40" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="52" r="20" fill="none" stroke="#3b93ff" strokeWidth="0.5" opacity="0">
            <animate attributeName="r" values="20;55" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0" dur="2.5s" repeatCount="indefinite" />
          </circle>
          {/* Label */}
          <text x="100" y="115" textAnchor="middle" fill="#878aa5" fontSize="9" fontFamily="Inter, sans-serif">Photo-Organizer.dmg</text>
          <text x="100" y="130" textAnchor="middle" fill="#535572" fontSize="7" fontFamily="Inter, sans-serif">Mounting disk image...</text>
        </svg>
      </div>

      {/* Step 2: Drag to Applications animation */}
      <div className="mac-step-visual mac-step-2 absolute inset-0 flex items-center justify-center opacity-0">
        <svg viewBox="0 0 260 160" className="w-56 h-40 sm:w-64 sm:h-48">
          <defs>
            <linearGradient id="app-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b93ff" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="folder-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b93ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e6ff5" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* App icon (left side) */}
          <g>
            <rect x="30" y="35" width="60" height="60" rx="14" fill="none" stroke="url(#app-grad)" strokeWidth="1.8" />
            <rect x="30" y="35" width="60" height="60" rx="14" fill="#3b93ff" opacity="0.06" />
            {/* Camera icon inside */}
            <circle cx="60" cy="62" r="12" fill="none" stroke="url(#app-grad)" strokeWidth="1.2" opacity="0.7" />
            <circle cx="60" cy="62" r="5" fill="#3b93ff" opacity="0.3" />
            <rect x="46" y="50" width="28" height="4" rx="2" fill="none" stroke="url(#app-grad)" strokeWidth="0.8" opacity="0.5" />
            <text x="60" y="110" textAnchor="middle" fill="#b1b3c5" fontSize="7" fontFamily="Inter, sans-serif">Photo Organizer</text>

            {/* Animate the app icon moving right */}
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 80,0; 80,0; 0,0"
              dur="3s"
              repeatCount="indefinite"
              keyTimes="0; 0.4; 0.7; 1"
            />
          </g>

          {/* Animated arrow */}
          <g opacity="0.6">
            <line x1="105" y1="65" x2="150" y2="65" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3">
              <animate attributeName="stroke-dashoffset" values="0;-14" dur="1s" repeatCount="indefinite" />
            </line>
            <polyline points="145,58 155,65 145,72" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
            </polyline>
          </g>

          {/* Applications folder (right side) */}
          <g>
            {/* Folder tab */}
            <path d="M170,40 h20 l6,8 h34 v0 h-60 z" fill="url(#folder-grad)" stroke="url(#app-grad)" strokeWidth="1" opacity="0.5" />
            {/* Folder body */}
            <rect x="170" y="48" width="60" height="47" rx="4" fill="url(#folder-grad)" stroke="url(#app-grad)" strokeWidth="1.2" />
            {/* "A" letter */}
            <text x="200" y="78" textAnchor="middle" fill="#3b93ff" fontSize="22" fontFamily="Inter, sans-serif" fontWeight="600" opacity="0.5">A</text>
            <text x="200" y="110" textAnchor="middle" fill="#878aa5" fontSize="7" fontFamily="Inter, sans-serif">Applications</text>
            {/* Glow when receiving */}
            <rect x="170" y="48" width="60" height="47" rx="4" fill="#3b93ff" opacity="0">
              <animate attributeName="opacity" values="0;0;0.15;0.15;0" dur="3s" repeatCount="indefinite" keyTimes="0;0.3;0.4;0.65;0.75" />
            </rect>
          </g>
        </svg>
      </div>

      {/* Step 3: Launch & sparkle animation */}
      <div className="mac-step-visual mac-step-3 absolute inset-0 flex items-center justify-center opacity-0">
        <svg viewBox="0 0 200 160" className="w-48 h-40 sm:w-56 sm:h-44">
          <defs>
            <linearGradient id="launch-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* App icon - centered */}
          <rect x="65" y="30" width="70" height="70" rx="16" fill="none" stroke="url(#launch-grad)" strokeWidth="2" />
          <rect x="65" y="30" width="70" height="70" rx="16" fill="#10b981" opacity="0.08" />
          {/* Camera icon */}
          <circle cx="100" cy="62" r="15" fill="none" stroke="url(#launch-grad)" strokeWidth="1.5" opacity="0.7" />
          <circle cx="100" cy="62" r="6" fill="#10b981" opacity="0.4" />

          {/* Checkmark overlay */}
          <circle cx="122" cy="42" r="10" fill="#10b981" opacity="0.9">
            <animate attributeName="r" values="0;10" dur="0.5s" fill="freeze" />
          </circle>
          <polyline points="117,42 120,45 127,38" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <animate attributeName="stroke-dasharray" values="0,20;20,0" dur="0.6s" fill="freeze" />
          </polyline>

          {/* Sparkles */}
          {[
            { cx: 45, cy: 25, delay: '0s' },
            { cx: 155, cy: 30, delay: '0.3s' },
            { cx: 40, cy: 90, delay: '0.6s' },
            { cx: 160, cy: 85, delay: '0.15s' },
            { cx: 100, cy: 15, delay: '0.45s' },
            { cx: 55, cy: 55, delay: '0.75s' },
            { cx: 145, cy: 60, delay: '0.5s' },
          ].map((s, i) => (
            <g key={i}>
              {/* 4-point star sparkle */}
              <path
                d={`M${s.cx},${s.cy - 5} L${s.cx + 1.5},${s.cy - 1.5} L${s.cx + 5},${s.cy} L${s.cx + 1.5},${s.cy + 1.5} L${s.cx},${s.cy + 5} L${s.cx - 1.5},${s.cy + 1.5} L${s.cx - 5},${s.cy} L${s.cx - 1.5},${s.cy - 1.5}Z`}
                fill={i % 2 === 0 ? '#10b981' : '#06b6d4'}
                opacity="0"
              >
                <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" repeatCount="indefinite" begin={s.delay} />
                <animateTransform attributeName="transform" type="rotate" values={`0 ${s.cx} ${s.cy};180 ${s.cx} ${s.cy}`} dur="1.2s" repeatCount="indefinite" begin={s.delay} />
                <animateTransform attributeName="transform" type="scale" values="0.5;1.2;0.5" dur="1.2s" repeatCount="indefinite" begin={s.delay} additive="sum" />
              </path>
            </g>
          ))}

          {/* Expanding ring */}
          <circle cx="100" cy="65" r="35" fill="none" stroke="#10b981" strokeWidth="1" opacity="0">
            <animate attributeName="r" values="35;70" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="65" r="35" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0">
            <animate attributeName="r" values="35;80" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
            <animate attributeName="opacity" values="0.3;0" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
          </circle>

          {/* Success text */}
          <text x="100" y="125" textAnchor="middle" fill="#10b981" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500">Ready to organize!</text>
          <text x="100" y="140" textAnchor="middle" fill="#535572" fontSize="7" fontFamily="Inter, sans-serif">Cmd + Space &rarr; Photo Organizer</text>
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Windows install animation                                          */
/* ------------------------------------------------------------------ */

function WindowsInstallAnimation({ activeStep }: { activeStep: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(-1);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    if (prevStepRef.current === activeStep) return;
    prevStepRef.current = activeStep;

    const ctx = gsap.context(() => {
      gsap.set('.win-step-visual', { opacity: 0, scale: 0.9 });
      const activeEl = el.querySelector(`.win-step-${activeStep}`);
      if (activeEl) {
        gsap.to(activeEl, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' });
      }
    }, el);

    return () => ctx.revert();
  }, [activeStep]);

  return (
    <div ref={containerRef} className="relative w-full h-64 sm:h-72 flex items-center justify-center">
      {/* Step 0: Download exe */}
      <div className="win-step-visual win-step-0 absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 200 160" className="w-48 h-40 sm:w-56 sm:h-44">
          <defs>
            <linearGradient id="win-dl-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b93ff" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* File icon */}
          <rect x="70" y="20" width="60" height="75" rx="6" fill="none" stroke="url(#win-dl-grad)" strokeWidth="1.8" />
          <rect x="70" y="20" width="60" height="75" rx="6" fill="#3b93ff" opacity="0.06" />
          <path d="M110,20 L130,20 L130,40 L110,40 Z" fill="none" stroke="url(#win-dl-grad)" strokeWidth="1" opacity="0.4" />
          <text x="100" y="60" textAnchor="middle" fill="#3b93ff" fontSize="11" fontFamily="JetBrains Mono, monospace" opacity="0.7">.exe</text>
          <rect x="50" y="110" width="100" height="6" rx="3" fill="#343544" />
          <rect x="50" y="110" width="0" height="6" rx="3" fill="url(#win-dl-grad)">
            <animate attributeName="width" values="0;100;0" dur="2.5s" repeatCount="indefinite" />
          </rect>
          <text x="100" y="135" textAnchor="middle" fill="#878aa5" fontSize="8" fontFamily="Inter, sans-serif">Downloading installer...</text>
        </svg>
      </div>

      {/* Step 1: Run installer */}
      <div className="win-step-visual win-step-1 absolute inset-0 flex items-center justify-center opacity-0">
        <svg viewBox="0 0 200 160" className="w-48 h-40 sm:w-56 sm:h-44">
          {/* Wizard window */}
          <rect x="35" y="15" width="130" height="100" rx="8" fill="none" stroke="#3b93ff" strokeWidth="1.5" opacity="0.6" />
          <rect x="35" y="15" width="130" height="100" rx="8" fill="#3b93ff" opacity="0.04" />
          {/* Title bar */}
          <rect x="35" y="15" width="130" height="22" rx="8" fill="#3b93ff" opacity="0.08" />
          <circle cx="50" cy="26" r="3" fill="#f87171" opacity="0.5" />
          <circle cx="60" cy="26" r="3" fill="#fbbf24" opacity="0.5" />
          <circle cx="70" cy="26" r="3" fill="#10b981" opacity="0.5" />
          {/* Wizard content */}
          <rect x="50" y="50" width="80" height="4" rx="2" fill="#44465d" />
          <rect x="50" y="60" width="60" height="4" rx="2" fill="#44465d" opacity="0.5" />
          <rect x="50" y="70" width="70" height="4" rx="2" fill="#44465d" opacity="0.3" />
          {/* Next button */}
          <rect x="110" y="88" width="40" height="16" rx="4" fill="#3b93ff" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
          </rect>
          <text x="130" y="99" textAnchor="middle" fill="white" fontSize="7" fontFamily="Inter, sans-serif">Next</text>
          <text x="100" y="135" textAnchor="middle" fill="#878aa5" fontSize="8" fontFamily="Inter, sans-serif">Setup Wizard</text>
        </svg>
      </div>

      {/* Step 2: Choose location */}
      <div className="win-step-visual win-step-2 absolute inset-0 flex items-center justify-center opacity-0">
        <svg viewBox="0 0 200 160" className="w-48 h-40 sm:w-56 sm:h-44">
          {/* Folder path */}
          <rect x="30" y="45" width="140" height="30" rx="6" fill="none" stroke="#3b93ff" strokeWidth="1.2" opacity="0.5" />
          <rect x="30" y="45" width="140" height="30" rx="6" fill="#3b93ff" opacity="0.04" />
          <text x="40" y="64" fill="#878aa5" fontSize="7" fontFamily="JetBrains Mono, monospace">C:\Program Files\Photo Organizer</text>
          {/* Folder icon */}
          <path d="M85,85 h10 l3,4 h17 v0 h-30 z" fill="#3b93ff" opacity="0.2" />
          <rect x="85" y="89" width="30" height="22" rx="3" fill="none" stroke="#3b93ff" strokeWidth="1.2" opacity="0.5" />
          {/* Loading bars */}
          <rect x="50" y="125" width="100" height="4" rx="2" fill="#343544" />
          <rect x="50" y="125" width="0" height="4" rx="2" fill="#3b93ff" opacity="0.6">
            <animate attributeName="width" values="0;100" dur="3s" repeatCount="indefinite" />
          </rect>
          <text x="100" y="145" textAnchor="middle" fill="#878aa5" fontSize="8" fontFamily="Inter, sans-serif">Installing components...</text>
        </svg>
      </div>

      {/* Step 3: Launch */}
      <div className="win-step-visual win-step-3 absolute inset-0 flex items-center justify-center opacity-0">
        <svg viewBox="0 0 200 160" className="w-48 h-40 sm:w-56 sm:h-44">
          <rect x="65" y="30" width="70" height="70" rx="16" fill="none" stroke="#10b981" strokeWidth="2" />
          <rect x="65" y="30" width="70" height="70" rx="16" fill="#10b981" opacity="0.08" />
          <circle cx="100" cy="62" r="15" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.7" />
          <circle cx="100" cy="62" r="6" fill="#10b981" opacity="0.4" />
          <circle cx="122" cy="42" r="10" fill="#10b981" opacity="0.9" />
          <polyline points="117,42 120,45 127,38" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Sparkles */}
          {[{ cx: 50, cy: 30 }, { cx: 150, cy: 35 }, { cx: 45, cy: 85 }, { cx: 155, cy: 80 }].map((s, i) => (
            <path
              key={i}
              d={`M${s.cx},${s.cy - 4} L${s.cx + 1.2},${s.cy - 1.2} L${s.cx + 4},${s.cy} L${s.cx + 1.2},${s.cy + 1.2} L${s.cx},${s.cy + 4} L${s.cx - 1.2},${s.cy + 1.2} L${s.cx - 4},${s.cy} L${s.cx - 1.2},${s.cy - 1.2}Z`}
              fill={i % 2 === 0 ? '#10b981' : '#06b6d4'}
              opacity="0"
            >
              <animate attributeName="opacity" values="0;0.7;0" dur="1.4s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
            </path>
          ))}
          <circle cx="100" cy="65" r="35" fill="none" stroke="#10b981" strokeWidth="1" opacity="0">
            <animate attributeName="r" values="35;65" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="100" y="125" textAnchor="middle" fill="#10b981" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500">Ready to organize!</text>
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Linux install animation                                            */
/* ------------------------------------------------------------------ */

function LinuxInstallAnimation({ activeStep }: { activeStep: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(-1);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    if (prevStepRef.current === activeStep) return;
    prevStepRef.current = activeStep;

    const ctx = gsap.context(() => {
      gsap.set('.linux-step-visual', { opacity: 0, scale: 0.9 });
      const activeEl = el.querySelector(`.linux-step-${activeStep}`);
      if (activeEl) {
        gsap.to(activeEl, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' });
      }
    }, el);

    return () => ctx.revert();
  }, [activeStep]);

  return (
    <div ref={containerRef} className="relative w-full h-64 sm:h-72 flex items-center justify-center">
      {/* Step 0: Download AppImage */}
      <div className="linux-step-visual linux-step-0 absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 200 160" className="w-48 h-40 sm:w-56 sm:h-44">
          <defs>
            <linearGradient id="linux-dl-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b93ff" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <rect x="70" y="20" width="60" height="75" rx="6" fill="none" stroke="url(#linux-dl-grad)" strokeWidth="1.8" />
          <rect x="70" y="20" width="60" height="75" rx="6" fill="#3b93ff" opacity="0.06" />
          <text x="100" y="55" textAnchor="middle" fill="#3b93ff" fontSize="8" fontFamily="JetBrains Mono, monospace" opacity="0.7">.AppImage</text>
          <text x="100" y="70" textAnchor="middle" fill="#535572" fontSize="7" fontFamily="Inter, sans-serif">91 MB</text>
          <rect x="50" y="110" width="100" height="6" rx="3" fill="#343544" />
          <rect x="50" y="110" width="0" height="6" rx="3" fill="url(#linux-dl-grad)">
            <animate attributeName="width" values="0;100;0" dur="2.5s" repeatCount="indefinite" />
          </rect>
          <text x="100" y="135" textAnchor="middle" fill="#878aa5" fontSize="8" fontFamily="Inter, sans-serif">Downloading...</text>
        </svg>
      </div>

      {/* Step 1: chmod +x */}
      <div className="linux-step-visual linux-step-1 absolute inset-0 flex items-center justify-center opacity-0">
        <svg viewBox="0 0 240 160" className="w-56 h-40 sm:w-64 sm:h-48">
          {/* Terminal window */}
          <rect x="20" y="15" width="200" height="110" rx="8" fill="#0e0e14" stroke="#44465d" strokeWidth="1.2" />
          <rect x="20" y="15" width="200" height="22" rx="8" fill="#1c1c26" />
          <circle cx="35" cy="26" r="3" fill="#f87171" opacity="0.6" />
          <circle cx="45" cy="26" r="3" fill="#fbbf24" opacity="0.6" />
          <circle cx="55" cy="26" r="3" fill="#10b981" opacity="0.6" />
          {/* Terminal text */}
          <text x="30" y="55" fill="#10b981" fontSize="7.5" fontFamily="JetBrains Mono, monospace">$</text>
          <text x="42" y="55" fill="#d5d6e0" fontSize="7.5" fontFamily="JetBrains Mono, monospace">chmod +x Photo-Organizer.AppImage</text>
          {/* Cursor blink */}
          <rect x="30" y="66" width="5" height="10" fill="#10b981" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0;0.8" dur="1s" repeatCount="indefinite" />
          </rect>
          <text x="120" y="145" textAnchor="middle" fill="#878aa5" fontSize="8" fontFamily="Inter, sans-serif">Make it executable</text>
        </svg>
      </div>

      {/* Step 2: Run */}
      <div className="linux-step-visual linux-step-2 absolute inset-0 flex items-center justify-center opacity-0">
        <svg viewBox="0 0 240 160" className="w-56 h-40 sm:w-64 sm:h-48">
          <rect x="20" y="15" width="200" height="110" rx="8" fill="#0e0e14" stroke="#44465d" strokeWidth="1.2" />
          <rect x="20" y="15" width="200" height="22" rx="8" fill="#1c1c26" />
          <circle cx="35" cy="26" r="3" fill="#f87171" opacity="0.6" />
          <circle cx="45" cy="26" r="3" fill="#fbbf24" opacity="0.6" />
          <circle cx="55" cy="26" r="3" fill="#10b981" opacity="0.6" />
          <text x="30" y="52" fill="#10b981" fontSize="7.5" fontFamily="JetBrains Mono, monospace">$</text>
          <text x="42" y="52" fill="#d5d6e0" fontSize="7.5" fontFamily="JetBrains Mono, monospace">./Photo-Organizer.AppImage</text>
          <text x="30" y="68" fill="#878aa5" fontSize="7" fontFamily="JetBrains Mono, monospace">Starting Photo Organizer...</text>
          {/* Loading dots */}
          <circle cx="30" cy="85" r="2" fill="#3b93ff">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" begin="0s" />
          </circle>
          <circle cx="38" cy="85" r="2" fill="#3b93ff">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" begin="0.2s" />
          </circle>
          <circle cx="46" cy="85" r="2" fill="#3b93ff">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" begin="0.4s" />
          </circle>
          <text x="120" y="145" textAnchor="middle" fill="#878aa5" fontSize="8" fontFamily="Inter, sans-serif">Launching application</text>
        </svg>
      </div>

      {/* Step 3: Desktop integration */}
      <div className="linux-step-visual linux-step-3 absolute inset-0 flex items-center justify-center opacity-0">
        <svg viewBox="0 0 200 160" className="w-48 h-40 sm:w-56 sm:h-44">
          <rect x="65" y="30" width="70" height="70" rx="16" fill="none" stroke="#10b981" strokeWidth="2" />
          <rect x="65" y="30" width="70" height="70" rx="16" fill="#10b981" opacity="0.08" />
          <circle cx="100" cy="62" r="15" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.7" />
          <circle cx="100" cy="62" r="6" fill="#10b981" opacity="0.4" />
          <circle cx="122" cy="42" r="10" fill="#10b981" opacity="0.9" />
          <polyline points="117,42 120,45 127,38" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {[{ cx: 50, cy: 30 }, { cx: 150, cy: 35 }, { cx: 45, cy: 85 }, { cx: 155, cy: 80 }].map((s, i) => (
            <path
              key={i}
              d={`M${s.cx},${s.cy - 4} L${s.cx + 1.2},${s.cy - 1.2} L${s.cx + 4},${s.cy} L${s.cx + 1.2},${s.cy + 1.2} L${s.cx},${s.cy + 4} L${s.cx - 1.2},${s.cy + 1.2} L${s.cx - 4},${s.cy} L${s.cx - 1.2},${s.cy - 1.2}Z`}
              fill={i % 2 === 0 ? '#10b981' : '#06b6d4'}
              opacity="0"
            >
              <animate attributeName="opacity" values="0;0.7;0" dur="1.4s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
            </path>
          ))}
          <circle cx="100" cy="65" r="35" fill="none" stroke="#10b981" strokeWidth="1" opacity="0">
            <animate attributeName="r" values="35;65" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="100" y="125" textAnchor="middle" fill="#10b981" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500">Ready to organize!</text>
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Platform detail panel                                              */
/* ------------------------------------------------------------------ */

function PlatformDetail({ platform }: { platform: PlatformInfo }) {
  const [activeStep, setActiveStep] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const steps = installSteps[platform.id];
  const isMac = platform.id === 'mac-silicon' || platform.id === 'mac-intel';
  const isWindows = platform.id === 'windows';

  // Entrance animation
  useEffect(() => {
    if (!panelRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }, panelRef);
    return () => ctx.revert();
  }, [platform.id]);

  // Step click animation
  const handleStepClick = useCallback((index: number) => {
    setActiveStep(index);
    if (!stepsRef.current) return;
    const stepEls = stepsRef.current.querySelectorAll('.install-step');
    const el = stepEls[index];
    if (el) {
      gsap.fromTo(el, { scale: 0.97 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    }
  }, []);

  return (
    <div ref={panelRef} className="mt-10">
      {/* Download button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <button className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-brand-600 text-white font-semibold text-lg hover:bg-brand-500 active:bg-brand-700 transition-all duration-200 shadow-lg shadow-brand-600/25 hover:shadow-brand-500/35 hover:scale-[1.02] active:scale-[0.98]">
          <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download for {platform.name}
        </button>
        <div className="text-sm text-surface-500">
          <span className="text-surface-400 font-medium">{platform.fileName}</span>
          <span className="mx-2 text-surface-700">|</span>
          <span>{platform.fileSize}</span>
          <span className="mx-2 text-surface-700">|</span>
          <span>v2.4.1</span>
        </div>
      </div>

      {/* Installation steps + animation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Steps list */}
        <div ref={stepsRef} className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-surface-500 mb-4">Installation Steps</h3>
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            const isComplete = i < activeStep;
            return (
              <button
                key={i}
                onClick={() => handleStepClick(i)}
                className={`install-step w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-600/10 border-brand-500/40 shadow-lg shadow-brand-500/5'
                    : isComplete
                      ? 'bg-accent-green/5 border-accent-green/20'
                      : 'bg-surface-900/30 border-surface-800/40 hover:border-surface-700/60 hover:bg-surface-900/50'
                }`}
              >
                {/* Step number / check */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : isComplete
                      ? 'bg-accent-green/20 text-accent-green'
                      : 'bg-surface-800/60 text-surface-500'
                }`}>
                  {isComplete ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>

                <div className="min-w-0">
                  <div className={`font-medium transition-colors duration-300 ${
                    isActive ? 'text-white' : isComplete ? 'text-accent-green' : 'text-surface-300'
                  }`}>
                    {step.title}
                  </div>
                  <div className={`text-sm mt-0.5 transition-colors duration-300 ${
                    isActive ? 'text-surface-300' : 'text-surface-500'
                  }`}>
                    {step.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Animated visualization */}
        <div className="flex items-center justify-center">
          <div className="w-full bg-surface-900/40 border border-surface-800/40 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-xs font-semibold uppercase tracking-widest text-surface-600 mb-2 text-center">Preview</div>
            {isMac && <MacInstallAnimation activeStep={activeStep} />}
            {isWindows && <WindowsInstallAnimation activeStep={activeStep} />}
            {platform.id === 'linux' && <LinuxInstallAnimation activeStep={activeStep} />}
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
        <p className="text-center text-surface-500 text-sm mt-8 animate-pulse">
          Select your platform above to get started
        </p>
      )}

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
