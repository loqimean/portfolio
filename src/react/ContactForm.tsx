import { useRef, useState } from 'react';
import { Toast } from './Toast';
import { useRecaptcha } from './useRecaptcha';
import { useToast } from './useToast';

interface ContactFormProps {
  t: {
    contactForm: {
      title: string;
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
      success: string;
      error: string;
      errorRecaptcha?: string;
      errorNetwork?: string;
    };
  };
  formspreeEndpoint: string;
  recaptchaSiteKey?: string;
}

export const ContactForm = ({ t, formspreeEndpoint, recaptchaSiteKey }: ContactFormProps) => {
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const { toast, showToast } = useToast();
  const recaptcha = useRecaptcha(recaptchaSiteKey);

  const cf = t.contactForm;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current || status === 'submitting') return;

    if (recaptchaSiteKey && !recaptcha.getResponse()) {
      showToast(cf.errorRecaptcha ?? cf.error, 'error');
      return;
    }

    setStatus('submitting');
    const formData = new FormData(formRef.current);

    try {
      const res = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      const data = await res.json();

      if (data.ok) {
        formRef.current?.reset();
        recaptcha.reset();
        showToast(cf.success, 'success');
      } else {
        showToast(cf.error, 'error');
      }
    } catch {
      showToast(cf.errorNetwork ?? cf.error, 'error');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <section id="contact-section">
      <div className="container">
        <div className="header">
          <h2 className="font-lato">{cf.title}</h2>
          <svg className="arrow-icon" width="26" height="26" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.0605 1.06055V27.0605M27.0605 27.0605H1.06055M27.0605 27.0605L1.06055 1.06055" stroke="#ECECEC" strokeWidth="3" />
          </svg>
        </div>

        <div className="flex-1 w-full lg:max-w-lg">
          <form id="contact-form" ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-white/90 mb-1.5">
                {cf.name}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder={cf.namePlaceholder}
                disabled={status === 'submitting'}
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-white/90 mb-1.5">
                {cf.email}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder={cf.emailPlaceholder}
                disabled={status === 'submitting'}
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-white/90 mb-1.5">
                {cf.message}
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                placeholder={cf.messagePlaceholder}
                disabled={status === 'submitting'}
              />
            </div>

            {recaptchaSiteKey && (
              <div id="recaptcha-container" className="[&_.grecaptcha-badge]:opacity-90" />
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="submit-button"
            >
              <i className="icon-[mdi--send] size-6 shrink-0" />
              {status === 'submitting' ? cf.submitting : cf.submit}
            </button>
          </form>

          {toast.show && <Toast message={toast.message} type={toast.type} />}
        </div>
      </div>
    </section>
  );
};
