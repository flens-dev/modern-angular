import { Routes } from '@angular/router';

import { provideFooServices } from './model';
import { provideFooInMemoryRepository } from './infrastructure';

const FOO_CHILD_ROUTES: Routes = [
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
];

export const FOO_ROUTES: Routes = [
  {
    path: '',
    providers: [provideFooInMemoryRepository(), provideFooServices()],
    children: FOO_CHILD_ROUTES,
  },
];
