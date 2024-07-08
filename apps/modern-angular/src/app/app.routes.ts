import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'typical',
    loadChildren: () => import('./typical').then((m) => m.AppTypicalModule),
  },
];
