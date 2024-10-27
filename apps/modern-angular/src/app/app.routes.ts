import { Route } from '@angular/router';
import {
  provideFooInMemoryRepository,
  //provideLocationBackOnFooCreated,
  provideNavigateToUpdateOnFooCreated,
} from './foos/infrastructure';

export const appRoutes: Route[] = [
  {
    path: 'foos',
    providers: [
      provideFooInMemoryRepository(),
      //provideLocationBackOnFooCreated(),
      provideNavigateToUpdateOnFooCreated(),
    ],
    loadChildren: () => import('./foos/public').then((m) => m.FOO_ROUTES),
  },
];
