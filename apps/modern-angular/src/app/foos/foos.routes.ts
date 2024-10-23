import { Routes } from '@angular/router';

import { provideFooInMemoryRepository } from './infrastructure';
import { provideCreateFooServiceConfig } from './services';

export const FOO_CHILDREN_ROUTES: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import('./controllers').then(
        ({ FooCreateComponent }) => FooCreateComponent,
      ),
  },
  {
    path: ':fooId/update',
    loadComponent: () =>
      import('./controllers').then(
        ({ FooUpdateComponent }) => FooUpdateComponent,
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./controllers').then(({ FoosComponent }) => FoosComponent),
  },
];

export const FOO_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideFooInMemoryRepository(),
      provideCreateFooServiceConfig({ onSuccess: 'UPDATE' }),
    ],
    children: FOO_CHILDREN_ROUTES,
  },
];
