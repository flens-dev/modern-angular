import { Component, computed, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Observable } from 'rxjs';

import {
  errorToString,
  injectServiceCall,
  isBusyState,
  isErrorState,
} from '@flens-dev/tools/common';
import { formNotValid, validFormSubmit } from '@flens-dev/tools/forms';

export abstract class MaterialAuthSignInDialogConfig {
  abstract signIn(username: string, password: string): Observable<true>;
}

export type MaterialAuthSignInDialogData = void;
export type MaterialAuthSignInDialogResult = true;

@Component({
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  templateUrl: './material-auth-sign-in-dialog.html',
})
export class MaterialAuthSignInDialogComponent {
  readonly #config = inject(MaterialAuthSignInDialogConfig);
  readonly #dialogRef =
    inject<
      MatDialogRef<MaterialAuthSignInDialogData, MaterialAuthSignInDialogResult>
    >(MatDialogRef);

  protected readonly signInForm = inject(NonNullableFormBuilder).group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  readonly #signInFormNotValid = formNotValid(this.signInForm);

  readonly #signInRequest = validFormSubmit(this.signInForm);

  readonly #signInState = injectServiceCall(
    this.#signInRequest,
    ({ username, password }) => this.#config.signIn(username, password),
    {
      behavior: 'CONCAT',
      onBusyChange: (busy) =>
        busy
          ? this.signInForm.disable({ emitEvent: false })
          : this.signInForm.enable({ emitEvent: false }),
      onSuccess: () => this.#dialogRef.close(true),
    },
  );

  protected readonly error = computed(() => {
    const state = this.#signInState.state();
    return isErrorState(state) ? errorToString(state.error) : null;
  });

  protected readonly busy = computed(() => {
    const state = this.#signInState.state();
    return isBusyState(state);
  });

  protected readonly submitDisabled = computed(() => {
    const signInFormNotValid = this.#signInFormNotValid();
    const busy = this.busy();
    return signInFormNotValid || busy;
  });
}
