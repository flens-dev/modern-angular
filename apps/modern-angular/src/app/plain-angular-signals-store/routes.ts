import { Routes } from '@angular/router';

export const PLAIN_ANGULAR_SIGNALS_STORE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./plain-angular-signals-store-example.component').then(
        ({ PlainAngularSignalsStoreExampleComponent }) =>
          PlainAngularSignalsStoreExampleComponent,
      ),
  },
];
