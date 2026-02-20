import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      render: (container: string | HTMLElement, options: { sitekey: string; theme?: string }) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
    };
  }
}

const RECAPTCHA_SCRIPT_ID = 'recaptcha-script';

export const useRecaptcha = (siteKey?: string) => {
  const widgetId = useRef<number | null>(null);

  useEffect(() => {
    if (!siteKey) return;

    const container = document.getElementById('recaptcha-container');
    if (!container) return;

    const render = () => {
      if (!window.grecaptcha || !siteKey) return;
      if (widgetId.current !== null) return;

      try {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

        widgetId.current = window.grecaptcha.render(container, { sitekey: siteKey, theme });
      } catch (err) {
        console.warn('reCAPTCHA render error:', err);
      }
    };

    if (document.getElementById(RECAPTCHA_SCRIPT_ID)) {
      window.grecaptcha?.ready(render);
      return;
    }

    const script = document.createElement('script');

    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.onload = () => window.grecaptcha?.ready(render);
    document.head.appendChild(script);

    return () => {
      widgetId.current = null;
    };
  }, [siteKey]);

  const getResponse = () =>
    window.grecaptcha?.getResponse?.(widgetId.current ?? undefined) ?? '';

  const reset = () => {
    if (widgetId.current !== null) {
      try {
        window.grecaptcha?.reset?.(widgetId.current);
      } catch {
        // ignore
      }
    }
  };

  return { getResponse, reset };
};
