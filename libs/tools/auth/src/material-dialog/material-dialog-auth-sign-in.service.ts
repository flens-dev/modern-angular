import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { finalize } from 'rxjs';

import type { AuthState } from '../auth-state';
import { AuthSignInService } from '../auth-sign-in.service';

import type {
  MaterialAuthSignInDialogData,
  MaterialAuthSignInDialogResult,
} from './material-auth-sign-in-dialog';
import { MaterialAuthSignInDialogComponent } from './material-auth-sign-in-dialog';

@Injectable()
export class MaterialDialogAuthSignInService extends AuthSignInService {
  readonly #state = signal<AuthState>('UNKNOWN');

  readonly #destroyRef = inject(DestroyRef);
  readonly #dialog = inject(MatDialog);
  #dialogRef: MatDialogRef<unknown, boolean | null> | null = null;

  override readonly state = this.#state.asReadonly();

  override triggerSignIn(): void {
    // Sanitiy check, we only want to open one dialog,
    // even if multiple requests are in flight.
    if (this.#dialogRef != null) {
      return;
    }

    this.#state.set('SIGNING_IN');

    const dialogRef = this.#dialog.open<
      MaterialAuthSignInDialogComponent,
      MaterialAuthSignInDialogData,
      MaterialAuthSignInDialogResult
    >(MaterialAuthSignInDialogComponent, {
      closeOnNavigation: false,
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .pipe(
        finalize(() => {
          this.#dialogRef = null;
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.#state.set('SIGNED_IN');
          }
        },
      });

    this.#dialogRef = dialogRef;
  }
}
