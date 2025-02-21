import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { finalize } from 'rxjs';

import type { AuthState } from '../auth-state';
import { AuthSignInClient } from '../auth-sign-in.client';

import type {
  MaterialAuthSignInDialogData,
  MaterialAuthSignInDialogResult,
} from './material-auth-sign-in-dialog';
import { MaterialAuthSignInDialogComponent } from './material-auth-sign-in-dialog';

@Injectable()
export abstract class MaterialDialogAuthSignInClient extends AuthSignInClient {
  readonly #state = signal<AuthState>('UNKNOWN');

  readonly #destroyRef = inject(DestroyRef);
  readonly #dialog = inject(MatDialog);

  #dialogRef: MatDialogRef<
    MaterialAuthSignInDialogComponent,
    MaterialAuthSignInDialogResult
  > | null = null;

  override readonly state = this.#state.asReadonly();

  override triggerSignIn(): void {
    // Sanity check, we only want to open one dialog,
    // even if multiple requests are in flight.
    if (this.#dialogRef != null) {
      console.warn('triggerSignIn should not be called with open dialog');
      return;
    }

    this.#state.set('SIGNING_IN');

    this.#dialogRef = this.#dialog.open<
      MaterialAuthSignInDialogComponent,
      MaterialAuthSignInDialogData,
      MaterialAuthSignInDialogResult
    >(MaterialAuthSignInDialogComponent, {
      closeOnNavigation: false,
      disableClose: true,
    });

    this.#dialogRef
      .afterClosed()
      .pipe(
        finalize(() => {
          this.#dialogRef = null;
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: () => {
          this.#state.set('SIGNED_IN');
        },
      });
  }
}
