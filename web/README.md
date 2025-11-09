# LibreLoom Web - React + Vite Application

This is the LibreLoom website, restructured as a modern React + Vite application.

## Project Structure

```
web/
├── public/              # Static assets (served as-is)
├── src/
│   ├── components/      # React components
│   │   ├── Home.jsx
│   │   ├── Projects.jsx
│   │   ├── Team.jsx
│   │   └── Footer.jsx
│   ├── pages/          # Original HTML files (for reference)
│   │   ├── projects.html
│   │   ├── team.html
│   │   └── EXAMPLE.html
│   ├── styles/         # Component-specific CSS files
│   │   ├── Home.css
│   │   ├── Projects.css
│   │   ├── Team.css
│   │   └── Footer.css
│   ├── assets/         # Images, logos, and other assets
│   │   ├── abstract/   # Background images
│   │   └── logo/       # Logo files
│   ├── App.jsx         # Main app component with routing
│   ├── main.jsx        # React entry point
│   └── index.css       # Global styles
├── index.html          # HTML entry point for Vite
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── .gitignore

```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

Start the development server with hot-reload:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Technology Stack

- **React 18** - UI framework
- **Vite 5** - Fast build tool and dev server
- **React Router 6** - Client-side routing
- **CSS** - Component-scoped styling

## Features

- 🚀 Fast development with Vite HMR (Hot Module Replacement)
- 🎨 Modern, responsive design with theme switching
- 📱 Mobile-friendly navigation
- 🔗 Client-side routing with React Router
- ⚡ Optimized production builds

## Routes

- `/` - Home page
- `/team` - Team page
- `/projects` - Projects page

## Notes

- Original HTML files are preserved in `src/pages/` for reference
- Assets are stored in the `src/assets/` directory and imported as modules
- The application uses CSS custom properties (CSS variables) for theming
- Theme preference is saved to localStorage

## Development

The codebase follows React best practices:
- Functional components with hooks
- Component-scoped CSS
- React Router for navigation
- Reusable Footer component across all pages

## License

See the main repository LICENSE file for details.
