import { Route, Routes } from '@angular/router';

import { provideFooInMemoryRepository } from './infrastructure';
import { provideCreateFooServiceConfig } from './services';

export type CreateFooRoute = Omit<Route, 'path'> & {
  path: 'create';
};
export type UpdateFooRoute = Omit<Route, 'path'> & {
  path: ':fooId/update';
};
export type FoosRoute = Omit<Route, 'path'> & {
  path: '';
};

export type FooChildRoutes = [CreateFooRoute, UpdateFooRoute, FoosRoute];

export const FOO_CHILD_ROUTES: FooChildRoutes = [
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
    children: FOO_CHILD_ROUTES,
  },
];
