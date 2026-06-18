# LibreLoom Web - React + Vite Application

This is the LibreLoom website, built as a modern React + Vite application.

## Project Structure

```
web/
├── public/
│   └── favicon.png
├── src/
│   ├── assets/
│   │   ├── abstract/   # Background images
│   │   └── logo/       # Logo files (SVG + PNG)
│   ├── components/
│   │   ├── Home.jsx
│   │   ├── Navigation.jsx
│   │   ├── Projects.jsx
│   │   ├── Settings.jsx
│   │   ├── Sponsors.jsx
│   │   ├── Team.jsx
│   │   └── cards/      # Reusable card components
│   │       ├── Card.jsx
│   │       ├── Card.css
│   │       ├── MissionCard.jsx
│   │       ├── ModalCard.jsx
│   │       ├── ProjectCard.jsx
│   │       ├── SponsorCard.jsx
│   │       ├── TeamCard.jsx
│   │       └── index.js
│   ├── styles/         # Component-specific CSS
│   │   ├── Home.css
│   │   ├── Modal.css
│   │   ├── Navigation.css
│   │   ├── Projects.css
│   │   ├── Settings.css
│   │   ├── Sponsors.css
│   │   └── Team.css
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

The app will be available at `http://localhost:3000`. The dev server is
configured to open the browser automatically on start.

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The built files (with sourcemaps) will be in the `dist/` directory.

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

- Fast development with Vite HMR (Hot Module Replacement)
- Modern, responsive design with theme switching (light/dark)
- Mobile-friendly navigation
- Client-side routing with React Router
- Optimized production builds with sourcemaps
- Reusable card components for projects, team members, sponsors, and missions

## Routes

- `/` - Home page
- `/projects` - Projects page
- `/team` - Team page
- `/sponsors` - Sponsors page

## Notes

- Navigation (including the footer and theme switching) is handled by the
  `Navigation` component, which is shared across all pages.
- The application uses CSS custom properties (CSS variables) for theming.
- Theme preference is persisted to `localStorage`.
- Assets are stored in `src/assets/` and imported as modules in components.

## Development

The codebase follows React best practices:

- Functional components with hooks
- Component-scoped CSS
- React Router for navigation
- Reusable card components in `src/components/cards/`

## License

See the main repository LICENSE file for details.
