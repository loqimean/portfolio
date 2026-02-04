
import { useEffect, useState } from 'react';

export const ThemeToggle = (props: { t: any }) => {
  const { t } = props;
  const [isDark, setIsDark] = useState(() => {
    const localTheme = localStorage.getItem('theme');
    const htmlTheme = document.documentElement.getAttribute('data-theme');

    return (localTheme || htmlTheme) === 'dark';
  })

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';

    setIsDark(!isDark);

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center gap-2"
      aria-label="Toggle theme"
      role="switch"
      id="theme-toggle"
      aria-checked={isDark}
    >
      <span className="uppercase">{t.darkmood}</span>
      <input type="checkbox" readOnly checked={isDark} className="toggle dark:bg-slate-200/40 bg-transparent" />
    </button>
  );
};
