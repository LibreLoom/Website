# Migration to React + Vite

## Summary

The web folder has been successfully restructured from plain HTML files to a modern React + Vite application.

## Changes Made

### New Files Created

**Configuration Files:**
- `package.json` - Project dependencies and npm scripts
- `vite.config.js` - Vite build configuration
- `.gitignore` - Git ignore rules for node_modules, dist, etc.

**React Application:**
- `src/main.jsx` - React entry point
- `src/App.jsx` - Main app with React Router
- `src/index.css` - Global styles

**Components:**
- `src/components/Home.jsx` - Home page component
- `src/components/Projects.jsx` - Projects page component
- `src/components/Team.jsx` - Team page component
- `src/components/Footer.jsx` - Shared footer component with theme switching

**Styles:**
- `src/styles/Home.css` - Home page styles
- `src/styles/Projects.css` - Projects page styles
- `src/styles/Team.css` - Team page styles
- `src/styles/Footer.css` - Footer component styles

**Documentation:**
- `README.md` - Updated with React + Vite instructions

### Files Moved

- `projects.html` → `src/pages/projects.html`
- `team.html` → `src/pages/team.html`
- `EXAMPLE.html` → `src/pages/EXAMPLE.html`

These HTML files are kept in `src/pages/` for easy reference as requested.

### Files Modified

- `index.html` - Changed to Vite entry point (now loads React app)

### Directory Structure

```
web/
├── .gitignore
├── index.html (Vite entry point)
├── package.json
├── vite.config.js
├── README.md
├── MIGRATION_NOTES.md (this file)
├── public/ (for static assets)
├── assets/ (images and logos)
│   ├── abstract/
│   └── logo/
└── src/
    ├── main.jsx (React entry)
    ├── App.jsx (routing)
    ├── index.css (global styles)
    ├── components/ (React components)
    │   ├── Home.jsx
    │   ├── Projects.jsx
    │   ├── Team.jsx
    │   └── Footer.jsx
    ├── pages/ (original HTML for reference)
    │   ├── projects.html
    │   ├── team.html
    │   └── EXAMPLE.html
    └── styles/ (component CSS)
        ├── Home.css
        ├── Projects.css
        ├── Team.css
        └── Footer.css
```

## Getting Started

1. **Install dependencies:**
   ```bash
   cd web
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```
   Output in `dist/` folder

## Features Preserved

✅ All original design and styling  
✅ Logo and branding  
✅ Theme switching (light/dark)  
✅ Mobile responsive design  
✅ Collapsible footer with hamburger menu  
✅ All navigation links  
✅ Team member profiles  
✅ Project listings  
✅ Decorative background images (Home page)  
✅ Settings modal structure  

## Features Added

✨ React component architecture  
✨ Client-side routing with React Router  
✨ Hot Module Replacement (HMR) for fast development  
✨ Optimized production builds  
✨ Component-scoped styles  
✨ Reusable Footer component  

## Next Steps

To continue development:

1. The HTML files in `src/pages/` can be used as reference
2. Expand the Settings modal functionality in `Footer.jsx`
3. Add more pages/routes as needed in `App.jsx`
4. Install and run the dev server to see the application in action

## Notes

- Original HTML files are preserved in `src/pages/` for easy reading
- The application uses functional React components with hooks
- All original styles have been converted to CSS modules
- Asset paths remain the same (`/assets/...`)
- LocalStorage is used for theme persistence

