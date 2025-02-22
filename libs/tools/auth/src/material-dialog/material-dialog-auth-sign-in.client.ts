import { inject, Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { finalize, Observable } from 'rxjs';

import { AuthSignInClient } from '../auth-sign-in.client';

import { MaterialAuthSignInDialogComponent } from './material-auth-sign-in-dialog';

@Injectable()
export abstract class MaterialDialogAuthSignInClient extends AuthSignInClient {
  readonly #dialog = inject(MatDialog);

  #retryTrigger: Observable<void> | null = null;

  override triggerSignIn(): Observable<void> {
    if (this.#retryTrigger != null) {
      return this.#retryTrigger;
    }

    this.#retryTrigger = this.#dialog
      .open<MaterialAuthSignInDialogComponent, void, void>(
        MaterialAuthSignInDialogComponent,
        {
          closeOnNavigation: false,
          disableClose: true,
        },
      )
      .afterClosed()
      .pipe(
        finalize(() => {
          this.#retryTrigger = null;
        }),
      );

    return this.#retryTrigger;
  }
}
