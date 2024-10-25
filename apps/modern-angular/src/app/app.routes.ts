import { Route } from '@angular/router';
import { provideFooInMemoryRepository } from './foos/infrastructure';
import { provideCreateFooServiceConfig } from './foos/public';

export const appRoutes: Route[] = [
  {
    path: 'foos',
    providers: [
      provideFooInMemoryRepository(),
      provideCreateFooServiceConfig({ onSuccess: 'UPDATE' }),
    ],
    loadChildren: () => import('./foos/public').then((m) => m.FOO_ROUTES),
  },
];
