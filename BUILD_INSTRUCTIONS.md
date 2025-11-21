# HotCash Frontend - Build Instructions

## Local Production Build

To verify that styles work correctly in production build:

1. Install dependencies:
```bash
npm install
```

2. Build for production:
```bash
npm run build
```

3. Preview production build:
```bash
npm run preview
```

4. Open browser at `http://localhost:4173`

The preview should show the same modern UI as development mode (`npm run dev`).

## Tailwind CSS Configuration

This project uses Tailwind CSS for styling. The configuration includes:
- `tailwind.config.js` - Main configuration file
- `postcss.config.js` - PostCSS plugin configuration
- `src/index.css` - Contains Tailwind directives and custom styles

## Vercel Deployment

Vercel automatically builds and deploys from the `main` branch. The build process uses the same `npm run build` command, so if the local preview looks good, the production deployment will too.