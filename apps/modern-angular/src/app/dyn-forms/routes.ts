import { Routes } from '@angular/router';

export const DYN_FORMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dyn-forms-example.component').then(
        ({ DynFormsExampleComponent }) => DynFormsExampleComponent,
      ),
  },
];
