import { Routes } from '@angular/router';

import { provideFooServices } from './model';
import { provideFooInMemoryRepository } from './infrastructure';

const FOO_CHILD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./foo.component').then((m) => m.FooComponent),
  },
];

export const FOO_ROUTES: Routes = [
  {
    path: '',
    providers: [provideFooInMemoryRepository(), provideFooServices()],
    children: FOO_CHILD_ROUTES,
  },
];
