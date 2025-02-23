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
    loadChildren: () => import('./foos').then((m) => m.FOO_ROUTES),
  },
  {
    path: 'dyn-forms',
    loadChildren: () => import('./dyn-forms').then((m) => m.DYN_FORMS_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'plain-angular-signals-store',
    loadChildren: () =>
      import('./plain-angular-signals-store').then(
        (m) => m.PLAIN_ANGULAR_SIGNALS_STORE_ROUTES,
      ),
  },
];
