import { gsap } from 'gsap';

let buttonScale = 1;
const SCALE_INCREMENT = 0.05;
const DEFAULT_BUTTON_SCALE = 1;
let downloadCvButton: HTMLButtonElement | null = null;

const setDownloadCvButton = (button: HTMLButtonElement | null) => {
  downloadCvButton = button;
};

const triggerPulseButton = () => {
  const button = document.getElementById("download-cv-button");

  if (!button) {
    console.error("Download CV button not found");
    return;
  }

  // Trigger shadow pulse animation
  button.style.animation = 'none';
  button.offsetHeight; // force repaint
  button.style.animation = 'shadow-pulse 0.8s 1';

  // Incrementally scale up the button (add to current scale)
  buttonScale += SCALE_INCREMENT;

  gsap.to(button, {
    scale: buttonScale,
    duration: 0.6,
    ease: "power2.out"
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
