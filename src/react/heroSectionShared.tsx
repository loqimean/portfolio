import type { ReactNode } from 'react';

interface HeroSectionShellProps {
  t: any;
  containerClassName?: string;
  children: ReactNode;
}

export function HeroSectionShell(props: HeroSectionShellProps) {
  const { t, containerClassName = '', children } = props;

  return (
    <section className="flex flex-col bg-accent mx-5 rounded-t-3xl dark:bg-neutral-black h-[95vh]">
      <div className={`relative mx-auto h-full container ${containerClassName}`.trim()}>
        {children}

        <div className="flex z-10 flex-col gap-2 mt-auto absolute bottom-10 left-5">
          <a className="size-6 md:size-10" href="https://github.com/loqimean" title="GitHub" target="_blank" rel="noopener noreferrer">
            <span className="icon-[jam--github] h-full w-full"></span>
          </a>
          <a className="size-6 md:size-10" href="https://www.linkedin.com/in/loqimean/" title="LinkedIn" target="_blank" rel="noopener noreferrer">
            <span className="icon-[jam--linkedin] h-full w-full"></span>
          </a>
          <a className="size-6 md:size-10" href="https://t.me/lMad_Hatterl" title="Telegram" target="_blank" rel="noopener noreferrer">
            <span className="icon-[jam--telegram] h-full w-full"></span>
          </a>
          <a className="size-6 md:size-10" href="mailto:marynych.ivan@icloud.com" title="Email" target="_blank" rel="noopener noreferrer">
            <span className="icon-[jam--envelope] h-full w-full"></span>
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
  );
}
