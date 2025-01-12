import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { formNotValid, validFormSubmit } from '@flens-dev/tools/forms';

import type { GetFoosRequest } from '../public';

import { FOOS_SEARCH_FORM, provideFoosSearchForm } from '../model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foos-search-form',
  templateUrl: './foos-search-form.component.html',
  styleUrl: '../common.css',
  providers: [provideFoosSearchForm()],
  imports: [ReactiveFormsModule],
})
export class FoosSearchFormComponent {
  protected readonly searchForm = inject(FOOS_SEARCH_FORM);

  readonly value = input<GetFoosRequest>();

  protected readonly submitDisabled = formNotValid(this.searchForm);

  readonly submit = outputFromObservable(validFormSubmit(this.searchForm));

  constructor() {
    effect(() => {
      const getFoosRequest = this.value();
      untracked(() => {
        if (getFoosRequest) {
          this.searchForm.patchValue(getFoosRequest, { emitEvent: false });
        } else {
          this.searchForm.reset(undefined, { emitEvent: false });
        }
      });
    });
  }
}
