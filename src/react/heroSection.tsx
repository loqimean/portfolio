import { lazy, Suspense, useState, useEffect } from 'react';
import { HeroSectionShell } from './heroSectionShared';

const Scene = lazy(() => import('./Scene'));

function SceneLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const id = window.setInterval(() => {
      const step = Math.max(0.4, (99 - current) * 0.06 + Math.random() * 2.5);
      current = Math.min(99, current + step);
      setProgress(Math.floor(current));
      if (current >= 99) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-full -mx-30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 select-none">
        <span className="text-white/40 text-[10px] uppercase tracking-[0.35em] font-mono">
          Loading
        </span>
        <span className="text-white text-8xl md:text-9xl font-mono font-bold tabular-nums leading-none">
          {String(progress).padStart(3, '')}%
        </span>
        <div className="w-36 h-px bg-white/15 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-white/60 transition-[width] duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export const HeroSectionDesktop = (props: { t: any }) => {
  const { t } = props

  return (
    <HeroSectionShell t={t}>
      <Suspense fallback={<SceneLoader />}>
        <Scene t={t} />
      </Suspense>
    </HeroSectionShell>
  )
}
