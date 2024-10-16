import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'foos',
    loadChildren: () => import('./foos').then((m) => m.FOO_ROUTES),
  },
  {
    path: 'typical',
    loadChildren: () => import('./typical').then((m) => m.AppTypicalModule),
  },
];
