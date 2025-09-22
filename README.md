# Vite + React + TypeScript + Supabase Application

A modern web application built with Vite, React, TypeScript, React Router v6, TanStack Query, and Supabase.

## Setup Instructions

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Configure Supabase:**
   - Create a new project at [Supabase](https://supabase.com)
   - Copy your project URL and anon key
   - Update `.env` with your Supabase credentials:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Test the application:**
   - Open your browser to the development server URL
   - Navigate to `/projects` to see the projects list placeholder
   - Test other routes:
     - `/projects/123/templates` - Template gallery for project 123
     - `/docs/456` - Document editor for document 456

## Project Structure

```
src/
├── components/
│   └── ui/           # Reusable UI components
├── lib/
│   └── supabaseClient.ts  # Supabase client configuration
├── pages/            # Page components
├── router.tsx        # React Router configuration
└── App.tsx          # Main application component
```

## Available Routes

- `/projects` - Projects list page
- `/projects/:projectId/templates` - Template gallery for a specific project
- `/docs/:docId` - Document editor for a specific document

## Technologies Used

- **Vite** - Build tool and dev server
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Supabase** - Backend-as-a-Service
- **Lucide React** - Icon library

## Development

The application uses modern React patterns including:
- Functional components with hooks
- TypeScript for type safety
- TanStack Query for server state management
- React Router for navigation
- Tailwind CSS for styling

Ready to build your next great application!