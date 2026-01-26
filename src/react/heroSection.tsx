import Scene from './Scene';

export const HeroSection = (props: { t: any }) => {
  const { t } = props

  return (
    <section className="min-h-screen flex flex-col bg-accent h-screen">
      <Scene t={t} />
      {/* <div className="px-5 py-10">
      </div> */}
      {/* <div className="flex flex-col gap-2 mt-auto">
        <span className="icon-[jam--github] size-10"></span>
        <span className="icon-[jam--linkedin] size-10"></span>
        <span className="icon-[jam--telegram] size-10"></span>
        <span className="icon-[jam--envelope] size-10"></span>
      </div> */}
    </section>
  )
}
