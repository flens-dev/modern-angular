import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  untracked,
} from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { formNotValid, validFormSubmit } from '@flens-dev/tools';

import { GetFoosRequest, createFoosSearchForm } from '../model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foos-search-form',
  templateUrl: './foos-search-form.component.html',
  styleUrl: '../foos.css',
  imports: [ReactiveFormsModule],
})
export class FoosSearchFormComponent {
  protected readonly searchForm = createFoosSearchForm();

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
