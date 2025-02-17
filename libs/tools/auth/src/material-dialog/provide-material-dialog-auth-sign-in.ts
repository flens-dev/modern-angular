import { Provider } from '@angular/core';

import { AuthSignInService } from '../auth-sign-in.service';

import { MaterialAuthSignInDialogConfig } from './material-auth-sign-in-dialog';
import { MaterialDialogAuthSignInService } from './material-dialog-auth-sign-in.service';

export const provideMaterialDialogAuthSignIn = <
  TConfig extends MaterialAuthSignInDialogConfig,
>(
  config: TConfig,
): Provider[] => [
  {
    provide: MaterialAuthSignInDialogConfig,
    useValue: config,
  },
  MaterialDialogAuthSignInService,
  {
    provide: AuthSignInService,
    useExisting: MaterialDialogAuthSignInService,
  },
];
