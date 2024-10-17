import { Routes } from '@angular/router';

import { provideFooServices } from './model';
import { provideFooInMemoryRepository } from './infrastructure';

const FOO_CHILD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./foos.component').then((m) => m.FoosComponent),
  },
];

export const FOO_ROUTES: Routes = [
  {
    path: '',
    providers: [provideFooInMemoryRepository(), provideFooServices()],
    children: FOO_CHILD_ROUTES,
  },
];
