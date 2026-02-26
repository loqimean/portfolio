import { gsap } from 'gsap';

let buttonScale = 1;
const SCALE_INCREMENT = 0.05;
const DEFAULT_BUTTON_SCALE = 1;
const MAX_BUTTON_SCALE = 1.45;
let downloadCvButton: HTMLButtonElement | null = null;

const setDownloadCvButton = (button: HTMLButtonElement | null) => {
  downloadCvButton = button;
};

const triggerPulseButton = () => {
  const button = downloadCvButton;

  if (!button) return;

  // Keep this as a compositor animation to avoid forced reflow.
  gsap.fromTo(button, {
    boxShadow: "0 0 0 0 var(--shadow-pulse-start-color)"
  }, {
    boxShadow: "0 0 7px 25px var(--shadow-pulse-end-color)",
    duration: 0.8,
    ease: "power1.out",
    overwrite: "auto"
  });

  buttonScale = Math.min(buttonScale + SCALE_INCREMENT, MAX_BUTTON_SCALE);

  gsap.to(button, {
    scale: buttonScale,
    duration: 0.6,
    ease: "power2.out",
    overwrite: "auto"
  });
}

const resetButtonScale = () => {
  const button = downloadCvButton;

  if (!button) return;

  buttonScale = DEFAULT_BUTTON_SCALE;

  gsap.to(button, {
    scale: buttonScale,
    duration: 0.3,
    ease: "power2.out",
    overwrite: "auto"
  });
}

const isButtonScaled = () => buttonScale > DEFAULT_BUTTON_SCALE;

const animateSkillsSetIcon = (skillName: string, start: string, end: string, markers: boolean = false) => {
  gsap.to(`#${skillName}-icon`, {
    scale: 0,
    opacity: 0.4,
    scrollTrigger: {
      trigger: `#${skillName}-icon`,
      markers: markers,
      start: start,
      end: end,
      scrub: 0.2,
      invalidateOnRefresh: true,
      fastScrollEnd: true
    },
    motionPath: {
      path: `#${skillName}-path`,
      align: `#${skillName}-path`,
      alignOrigin: [0.5, 0.5],
    },
    onComplete() {
      triggerPulseButton()
    }
  })
}

export { animateSkillsSetIcon, isButtonScaled, resetButtonScale, setDownloadCvButton };
