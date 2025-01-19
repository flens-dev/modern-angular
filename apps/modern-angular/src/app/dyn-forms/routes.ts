import { Routes } from '@angular/router';

export const DYN_FORMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./example.component').then(
        ({ ExampleComponent }) => ExampleComponent,
      ),
  },
];
