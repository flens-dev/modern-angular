import { Provider, Type } from '@angular/core';

import { AuthSignInClient } from '../auth-sign-in.client';

import { MaterialDialogAuthSignInClient } from './material-dialog-auth-sign-in.client';

export const provideMaterialDialogAuthSignIn = <
  TAuthSignInClient extends MaterialDialogAuthSignInClient,
>(
  authSignInClient: Type<TAuthSignInClient>,
): Provider[] => [
  authSignInClient,
  {
    provide: MaterialDialogAuthSignInClient,
    useExisting: authSignInClient,
  },
  {
    provide: AuthSignInClient,
    useExisting: authSignInClient,
  },
];
