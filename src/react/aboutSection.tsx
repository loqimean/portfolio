import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';

gsap.registerPlugin(SplitText, ScrollTrigger);

export const AboutSection = (props: { t: any, children: React.ReactNode }) => {
  const { t, children } = props;
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    // lighten up text on scroll using mask
    const splitText = new SplitText('h1 span', { type: 'words, chars', wordsClass: "about-words++" });
    gsap.timeline({
      scrollTrigger: {
        trigger: aboutSectionRef.current,
        start: 'top 80%',
        end: 'top 15%',
        scrub: true
      }
    }).set(splitText.chars, {
      color: 'white',
      stagger: 0.1,
      duration: 1,
      ease: 'power2.inOut'
    }, 0.1);
  });

  return (
    <section id="about-me" ref={aboutSectionRef}>
      <div className="flex items-end">
        {children}
      </div>

      <div className="pr-4 flex flex-col h-full">
        <h1>
          <span>{t.aboutText}</span>
          <span>{t.aboutText2}</span>
        </h1>

        <div className="mt-20 md:mt-60 pb-10 border-t-2 border-white/10 pt-6">
          <p className="text-[10px] md:text-base text-white/70">{t.aboutText3}</p>
        </div>
      </div>
    </section>
  )
}
