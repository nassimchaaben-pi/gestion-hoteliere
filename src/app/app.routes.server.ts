import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Avoid prerendering static routes in this front-end only mode — render on server
  // This prevents the build prerenderer from attempting to fetch `/assets/...`
  // during the static prerender phase which may not be available in the build environment.
  { path: '', renderMode: RenderMode.Server },
  { path: 'patients', renderMode: RenderMode.Server },
  { path: 'patients/new', renderMode: RenderMode.Server },
  { path: 'appointments', renderMode: RenderMode.Server },
  { path: 'appointments/new', renderMode: RenderMode.Server },
  { path: 'payments', renderMode: RenderMode.Server },
  { path: 'payments/new', renderMode: RenderMode.Server },

  // Dynamic routes (with parameters) should be handled by server-side rendering
  { path: '**', renderMode: RenderMode.Server }
];
