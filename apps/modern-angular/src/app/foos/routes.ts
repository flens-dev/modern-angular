import type { FooRoutes } from './public';

export const FOO_ROUTES: FooRoutes = [
  {
    path: 'create',
    loadComponent: () =>
      import('./controllers').then(
        ({ CreateFooComponent }) => CreateFooComponent,
      ),
  },
  {
    path: ':fooId/update',
    loadComponent: () =>
      import('./controllers').then(
        ({ UpdateFooComponent }) => UpdateFooComponent,
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./controllers').then(({ GetFoosComponent }) => GetFoosComponent),
  },
];
