# Portfolio - Astro

A modern, multilingual portfolio website built with Astro featuring theme switching and language support.

## Features

- 🌐 **Multi-language Support**: English, Spanish, and French
- 🌓 **Dark/Light Theme**: Toggle between dark and light modes with persistent preference
- 📱 **Responsive Design**: Works seamlessly on all devices
- ⚡ **Fast Performance**: Built with Astro for optimal speed
- 🎨 **Clean UI**: Modern and professional design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
pnpm i
```

### Development

Start the development server:

```bash
pnpm dev
```

The site will be available at `http://localhost:4321`

### Build

Create a production build:

```bash
npm build
```

### Preview

Preview the production build:

```bash
npm preview
```

## Customization

### Update Your Information

1. **Personal Details**: Edit `/src/i18n/translations.ts` to update your name, tagline, and descriptions in all languages
2. **Skills**: Modify the skills section in `/src/pages/index.astro`
3. **Contact Links**: Update email, GitHub, and LinkedIn URLs in `/src/pages/index.astro`

### Contact Form Setup

The contact form uses [Formspree](https://formspree.io) to send submissions to your email. Without configuration, the "Contact Me" button falls back to a `mailto:` link.

1. **Create a Formspree account** at [formspree.io](https://formspree.io)
2. **Create a new form** and add your Gmail (or any email) as the recipient
3. **Copy your form endpoint** (e.g. `https://formspree.io/f/abc123xyz`)
4. **Add to `.env`**:
   ```
   PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
   ```

5. **Optional – reCAPTCHA** (recommended for spam protection):
   - Create reCAPTCHA v2 keys at [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
   - Add the **site key** to `.env`: `PUBLIC_RECAPTCHA_SITE_KEY=your_site_key`
   - In Formspree dashboard: Settings → Spam Prevention → enable reCAPTCHA and add your **secret key**

6. **Vercel**: Add the same variables in Project Settings → Environment Variables

### Add More Languages

To add a new language:

1. Open `/src/i18n/translations.ts`
2. Add a new language object (e.g., `de` for German)
3. Update the language switcher in `/src/components/Header.astro`

### Customize Styling

- **Colors**: Modify CSS variables in `/src/layouts/Layout.astro`
- **Layout**: Update styles in `/src/pages/index.astro`

## Project Structure

```
/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable components
│   │   └── Header.astro
│   ├── i18n/        # Internationalization
│   │   └── translations.ts
│   ├── layouts/     # Page layouts
│   │   └── Layout.astro
│   └── pages/       # Routes
│       └── index.astro
└── package.json
```

## Technologies

- [Astro](https://astro.build) - Static Site Generator
- TypeScript - Type Safety
- CSS3 + TailwindCSS - Styling
- ReactJS - components
- GSAP - animations
- iconify - icons

## License

MIT
