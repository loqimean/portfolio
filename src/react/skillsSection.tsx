import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import skillsLines from '../images/skills-lines.svg';
import { useRef } from 'react';
import { animateSkillsSetIcon, isButtonScaled, resetButtonScale, setDownloadCvButton } from '../helpers/skillsHelper';

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

const iconAnimations: Array<{ skillName: string; start: string; end: string }> = [
  { skillName: "astro", start: "top 45%", end: "top 10%" },
  { skillName: "redis", start: "top 47%", end: "top 0%" },
  { skillName: "docker", start: "top 50%", end: "top 30%" },
  { skillName: "github", start: "top 40%", end: "top 20%" },
  { skillName: "arduino", start: "top 60%", end: "top 30%" },
  { skillName: "google-cloud", start: "top 40%", end: "top 20%" },
  { skillName: "rails", start: "top 40%", end: "top 10%" },
  { skillName: "js", start: "top 50%", end: "top 20%" },
  { skillName: "css", start: "top 50%", end: "top 20%" },
  { skillName: "ruby", start: "top 50%", end: "top 20%" },
  { skillName: "mjml", start: "top 50%", end: "top 20%" },
  { skillName: "elasticsearch", start: "top 80%", end: "top 40%" },
  { skillName: "bash", start: "top 70%", end: "top 40%" },
  { skillName: "react", start: "top 50%", end: "top 20%" },
  { skillName: "mysql", start: "top 30%", end: "top 0%" },
  { skillName: "aws", start: "top 30%", end: "top 0%" },
  { skillName: "html", start: "top 30%", end: "top 0%" },
  { skillName: "capistrano", start: "top 60%", end: "top 20%" },
  { skillName: "postgresql", start: "top 60%", end: "top 20%" },
];

export const SkillsSection = (props: { t: any, children: React.ReactNode, cvUrl?: string }) => {
  const { t, children, cvUrl } = props;
  const skillsSetIconContainerRef = useRef<HTMLDivElement>(null);
  const downloadCVButtonRef = useRef<HTMLButtonElement>(null);

  const handleDownloadCV = () => {
    if (!cvUrl) return;

    const a = document.createElement('a');

    a.href = cvUrl;
    a.download = cvUrl.split('/').pop() || '';

    a.click();
  };

  useGSAP(() => {
    setDownloadCvButton(downloadCVButtonRef.current);
    iconAnimations.forEach(({ skillName, start, end }) => animateSkillsSetIcon(skillName, start, end));

    const resetButtonTrigger = ScrollTrigger.create({
      trigger: "#skills-section",
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        if (self.direction === -1 && isButtonScaled()) {
          resetButtonScale();
        }
      }
    });

    return () => {
      resetButtonTrigger.kill();
      setDownloadCvButton(null);
    };
  }, { scope: skillsSetIconContainerRef });

  return (
    <section id="skills-section">
      <div className="px-10">
        {/* Skills Grid */}
        <div className="flex flex-col items-center justify-center gap-10">
          <div ref={skillsSetIconContainerRef}>{children}</div>

          {/* Download CV black button */}
          <button
            ref={downloadCVButtonRef}
            id="download-cv-button"
            onClick={handleDownloadCV}
          >
            <span className="w-5 h-5 icon-[humbleicons--download]"></span>
            <span>{t.downloadCV}</span>
          </button>
        </div>
      </div>

      <img src={skillsLines.src} alt="Skills Lines" className="w-full h-auto absolute top-1/3 -translate-y-1/2 -z-10" />
    </section>
  )
}
