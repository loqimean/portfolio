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
- CSS3 - Styling

## License

MIT
