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
        path: ':fooId/edit',
        loadComponent: () =>
          import('./controllers').then(
            ({ FooEditComponent }) => FooEditComponent,
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
