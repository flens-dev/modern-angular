import { Provider } from '@angular/core';

import { AuthSignInService } from '../auth-sign-in-service';

import { MaterialDialogAuthSignInConfig } from './material-auth-sign-in-dialog';
import { MaterialDialogAuthSignInService } from './material-dialog-auth-sign-in.service';

export const provideMaterialDialogAuthSignIn = <
  TConfig extends MaterialDialogAuthSignInConfig,
>(
  config: TConfig,
): Provider[] => [
  {
    provide: MaterialDialogAuthSignInConfig,
    useValue: config,
  },
  MaterialDialogAuthSignInService,
  {
    provide: AuthSignInService,
    useExisting: MaterialDialogAuthSignInService,
  },
];
