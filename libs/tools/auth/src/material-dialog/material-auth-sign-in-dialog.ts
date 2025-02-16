import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { formNotValid, validFormSubmit } from '@flens-dev/tools/forms';

import { catchError, Observable, of, switchMap } from 'rxjs';

export abstract class MaterialDialogAuthSignInConfig {
  abstract submitSignIn(username: string, password: string): Observable<true>;
}

export type MaterialAuthSignInDialogData = void;
export type MaterialAuthSignInDialogResult = boolean | null;

@Component({
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `<h2 matDialogTitle>Sign in</h2>

    <mat-dialog-content>
      <form [formGroup]="signInForm">
        <mat-form-field>
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" />
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button
        type="submit"
        mat-flat-button
        color="primary"
        [disabled]="submitDisabled()"
      >
        Sign in
      </button>
    </mat-dialog-actions>`,
})
export class MaterialAuthSignInDialogComponent {
  readonly #config = inject(MaterialDialogAuthSignInConfig);
  readonly #dialogRef =
    inject<
      MatDialogRef<MaterialAuthSignInDialogData, MaterialAuthSignInDialogResult>
    >(MatDialogRef);

  readonly #formBuilder = inject(NonNullableFormBuilder);
  protected readonly signInForm = this.#formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  readonly #signInNotValid = formNotValid(this.signInForm);

  protected readonly submitDisabled = computed(() => {
    const signInNotValid = this.#signInNotValid();
    // TODO disable button while submitting
    return signInNotValid;
  });

  constructor() {
    // TODO make resource
    validFormSubmit(this.signInForm)
      .pipe(
        switchMap(({ username, password }) =>
          this.#config
            .submitSignIn(username, password)
            // TODO add proper error handling
            .pipe(catchError((error) => of(false))),
        ),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (success) => {
          if (success) {
            this.#dialogRef.close(true);
          }
        },
      });
  }
}
