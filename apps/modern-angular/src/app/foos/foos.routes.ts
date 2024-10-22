import { Routes } from '@angular/router';

import { provideFooInMemoryRepository } from './infrastructure';

export const FOO_ROUTES: Routes = [
  {
    path: '',
    providers: [provideFooInMemoryRepository()],
    children: [
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
    ],
  },
];
