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
          import('./foo-create.component').then(
            ({ FooCreateComponent }) => FooCreateComponent,
          ),
      },
      {
        path: ':fooId/edit',
        loadComponent: () =>
          import('./foo-edit.component').then(
            ({ FooEditComponent }) => FooEditComponent,
          ),
      },
      {
        path: '',
        loadComponent: () =>
          import('./foos.component').then(({ FoosComponent }) => FoosComponent),
      },
    ],
  },
];
