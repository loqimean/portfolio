import { lazy, Suspense } from 'react';

const Scene = lazy(() => import('./Scene'));

export const HeroSection = (props: { t: any }) => {
  const { t } = props

  return (
    <section className="min-h-screen flex flex-col bg-accent mx-5 rounded-t-3xl dark:bg-neutral-black h-screen">
      <div className="relative mx-auto h-full container">
        <Suspense fallback={<div className="h-full -mx-30" />}>
          <Scene t={t} />
        </Suspense>
        <div className="flex flex-col gap-2 mt-auto absolute bottom-10 left-5">
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
        <div className="absolute bottom-10 right-5">
          <a href="https://github.com/loqimean" title="Recent Project" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline">
            <span className="uppercase text-sm md:text-xl">{t.recentProject}</span>
          </a>
          <span className="text-xl mx-2">-</span>
          <a href="https://github.com/loqimean" title="Open Source" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline">
            <span className="uppercase text-sm md:text-xl">{t.openSource}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
