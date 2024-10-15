import { Routes } from '@angular/router';

export const FOO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./foo.component').then((m) => m.FooComponent),
  },
];
