import type { ImageMetadata } from 'astro';
import SnowedImage from '../assets/images/products/snowed.png';

export interface Product {
  id: string;
  /**
   * Per-language tagline. Kept here, not in i18n: `t` is serialized into React
   * island props on every page, so a hidden product's text would leak into HTML.
   */
  tagline: Record<string, string>;
  name: string;
  url: string;
  image: ImageMetadata;
  /** Platforms, shown as small chips. */
  platforms: string[];
  /**
   * Not shown on the site yet (unreleased).
   * Preview with PUBLIC_SHOW_HIDDEN=1 at build time.
   */
  hidden?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 'snowed',
    name: 'Snowed',
    url: 'https://snowed.app/',
    image: SnowedImage,
    platforms: ['macOS'],
    tagline: {
      en: "Soft snow falls over your desktop and piles up on windows and the Dock. Shake it off, roll snowballs, build snowmen.",
      uk: "М’який сніг падає на робочий стіл і лягає на вікна та Dock. Струшуйте його, ліпіть сніжки й сніговиків.",
      pl: "Miękki śnieg pada na pulpit i osiada na oknach oraz w Docku. Strząśnij go, ulep śnieżki i bałwana.",
      es: "Nieve suave cae sobre tu escritorio y se acumula en las ventanas y el Dock. Sacúdela, haz bolas de nieve y muñecos.",
    },
    hidden: true,
  },
];

export function visibleProducts(): Product[] {
  const showHidden = import.meta.env.PUBLIC_SHOW_HIDDEN === '1';

  return PRODUCTS.filter(p => showHidden || !p.hidden);
}
