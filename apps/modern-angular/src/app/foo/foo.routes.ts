import { Routes } from '@angular/router';

import { provideFooInMemoryRepository } from './infrastructure';
import { FooService } from './model';

export const FOO_CHILD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./foo.component').then((m) => m.FooComponent),
  },
];

export const FOO_ROUTES: Routes = [
  {
    path: '',
    providers: [provideFooInMemoryRepository(), FooService],
    children: FOO_CHILD_ROUTES,
  },
];
