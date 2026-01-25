import gsap from 'gsap';
import { MotionPathHelper } from 'gsap/MotionPathHelper';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import skillsLines from '../images/skills-lines.svg';
import { useRef, useEffect } from 'react';
import { animateSkillsSetIcon, resetButtonScale } from '../helpers/skillsHelper';

gsap.registerPlugin(useGSAP, MotionPathHelper, ScrollTrigger, MotionPathPlugin);

export const SkillsSection = (props: { t: any, children: React.ReactNode }) => {
  const { t, children } = props;
  const skillsSetIconContainerRef = useRef<HTMLDivElement>(null);
  const downloadCVButtonRef = useRef<HTMLButtonElement>(null);
  const lastScrollY = useRef<number>(0);

  useGSAP(() => {
    animateSkillsSetIcon("astro", "top 45%", "top 10%")
    animateSkillsSetIcon("redis", "top 47%", "top 0%")
    animateSkillsSetIcon("docker", "top 50%", "top 30%")
    animateSkillsSetIcon("github", "top 40%", "top 20%")
    animateSkillsSetIcon("arduino", "top 60%", "top 30%")
    animateSkillsSetIcon("google-cloud", "top 40%", "top 20%")

    // not checked yet
    animateSkillsSetIcon("rails", "top 40%", "top 10%")
    animateSkillsSetIcon("js", "top 50%", "top 20%")
    animateSkillsSetIcon("css", "top 50%", "top 20%")
    animateSkillsSetIcon("ruby", "top 50%", "top 20%")
    animateSkillsSetIcon("mjml", "top 50%", "top 20%")
    animateSkillsSetIcon("elasticsearch", "top 80%", "top 40%")
    animateSkillsSetIcon("bash", "top 70%", "top 40%")
    animateSkillsSetIcon("react", "top 50%", "top 20%")
    animateSkillsSetIcon("mysql", "top 30%", "top 0%")
    animateSkillsSetIcon("aws", "top 30%", "top 0%")
    animateSkillsSetIcon("html", "top 30%", "top 0%")
    animateSkillsSetIcon("capistrano", "top 60%", "top 20%")
    animateSkillsSetIcon("postgresql", "top 60%", "top 20%")
  }, { scope: skillsSetIconContainerRef });

  // Handle scroll direction to reset button scale on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If scrolling up and button is scaled, reset it
      if (currentScrollY < lastScrollY.current) {
        const button = downloadCVButtonRef.current;

        if (button) {
          const currentScale = gsap.getProperty(button, "scale") as number;

          if (currentScale && currentScale > 1) {
            resetButtonScale();
          }
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="py-44 relative">
      <div className="px-10">
        {/* Skills Grid */}
        <div className="flex flex-col items-center justify-center gap-10">
          <div ref={skillsSetIconContainerRef}>{children}</div>

          {/* Download CV black button */}
          <button ref={downloadCVButtonRef} id="download-cv-button">
            <span className="w-5 h-5 icon-[humbleicons--download]"></span>
            <span>{t.downloadCV}</span>
          </button>
        </div>
      </div>

      <img src={skillsLines.src} alt="Skills Lines" className="w-full h-auto absolute top-1/3 -translate-y-1/2 -z-10" />
    </section>
  )
}
