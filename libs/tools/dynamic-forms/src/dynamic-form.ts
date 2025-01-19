import { Component, computed, input } from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { switchMap } from 'rxjs';

import { DynamicFormGroup } from './model';
import { createFormGroup } from './create-form-group';
import {
  DynamicFormGroupComponent,
  DynamicFormGroupComponentInput,
} from './dynamic-form-group';

@Component({
  selector: 'fest-dynamic-form',
  imports: [ReactiveFormsModule, DynamicFormGroupComponent],
  template: `@let grp = group();
    <form [formGroup]="grp.reactiveControl">
      <fest-dynamic-form-group [group]="grp" />
      <ng-content />
    </form>`,
})
export class DynamicFormComponent {
  readonly form = input.required<DynamicFormGroup>();

  readonly #formGroup = computed(() => {
    const form = this.form();
    const formGroup = createFormGroup(form);
    return formGroup;
  });

  protected readonly group = computed(
    (): DynamicFormGroupComponentInput => ({
      dynamicControl: this.form(),
      reactiveControl: this.#formGroup(),
    }),
  );

  readonly #formGroup$ = toObservable(this.#formGroup);

  readonly formEvents = outputFromObservable(
    this.#formGroup$.pipe(switchMap((formGroup) => formGroup.events)),
  );
}
