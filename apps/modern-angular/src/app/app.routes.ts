import { Route } from '@angular/router';
import {
  provideFooInMemoryRepository,
  provideNavigateToUpdateOnFooCreated,
} from './foos/infrastructure';

export const appRoutes: Route[] = [
  {
    path: 'foos',
    providers: [
      provideFooInMemoryRepository(),
      provideNavigateToUpdateOnFooCreated(),
    ],
    loadChildren: () => import('./foos/public').then((m) => m.FOO_ROUTES),
  },
];
