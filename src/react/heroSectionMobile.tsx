import { HeroSectionShell } from './heroSectionShared';

export const HeroSectionMobile = (props: { t: any }) => {
  const { t } = props

  return (
    <HeroSectionShell t={t} containerClassName="flex items-center">
      <h1 className="text-gray-200 text-[20vw] font-bold uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Welcome</h1>
      <img src="/stone.webp" alt="" className="w-full sm:max-h-[700px] max-h-[500px] h-full object-cover m-0!" fetchPriority="high" />
    </HeroSectionShell>
  )
}
