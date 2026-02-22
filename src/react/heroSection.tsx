import { lazy, Suspense, useState, useEffect } from 'react';

const Scene = lazy(() => import('./Scene'));

function SceneLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const id = setInterval(() => {
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

export const HeroSection = (props: { t: any }) => {
  const { t } = props

  return (
    <section className="min-h-screen flex flex-col bg-accent mx-5 rounded-t-3xl dark:bg-neutral-black h-screen">
      <div className="relative mx-auto h-full container">
        <Suspense fallback={<SceneLoader />}>
          <Scene t={t} />
        </Suspense>
        <div className="flex z-10 flex-col gap-2 mt-auto absolute bottom-10 left-5">
          <a href="https://github.com/loqimean" title="GitHub" target="_blank" rel="noopener noreferrer">
            <span className="icon-[jam--github] size-6 md:size-10"></span>
          </a>
          <a href="https://www.linkedin.com/in/loqimean/" title="LinkedIn" target="_blank" rel="noopener noreferrer">
            <span className="icon-[jam--linkedin] size-6 md:size-10"></span>
          </a>
          <a href="https://t.me/lMad_Hatterl" title="Telegram" target="_blank" rel="noopener noreferrer">
            <span className="icon-[jam--telegram] size-6 md:size-10"></span>
          </a>
          <a href="mailto:marynych.ivan@icloud.com" title="Email" target="_blank" rel="noopener noreferrer">
            <span className="icon-[jam--envelope] size-6 md:size-10"></span>
          </a>
        </div>
        <div className="z-10 absolute bottom-10 right-5">
          <a href="https://github.com/loqimean" title="Recent Project" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline">
            <span className="uppercase text-sm md:text-xl">{t.recentProject}</span>
          </a>
          <span className="text-xl mx-2">-</span>
          <a href="/opensource" title={t.openSource.title} target="_blank" rel="noopener noreferrer" className="no-underline hover:underline">
            <span className="uppercase text-sm md:text-xl">{t.openSource.title}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
