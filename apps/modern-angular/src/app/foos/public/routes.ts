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
