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
];
