import { Route } from '@angular/router';

export type CreateFooRoute = Omit<Route, 'path'> & {
  path: 'create';
};
export type UpdateFooRoute = Omit<Route, 'path'> & {
  path: ':fooId/update';
};
export type FoosRoute = Omit<Route, 'path'> & {
  path: '';
};

export type FooRoutes = [CreateFooRoute, UpdateFooRoute, FoosRoute];

export const FOO_ROUTES: FooRoutes = [
  {
    path: 'create',
    loadComponent: () =>
      import('../controllers').then(
        ({ FooCreateComponent }) => FooCreateComponent,
      ),
  },
  {
    path: ':fooId/update',
    loadComponent: () =>
      import('../controllers').then(
        ({ FooUpdateComponent }) => FooUpdateComponent,
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('../controllers').then(({ FoosComponent }) => FoosComponent),
  },
];
