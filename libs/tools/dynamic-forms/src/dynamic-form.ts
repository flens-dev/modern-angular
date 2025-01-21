import { Component, computed, input } from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { switchMap } from 'rxjs';

import {
  DynamicFormField,
  DynamicFormGroup,
  DynamicFormItem,
  DynamicFormRow,
  isDynamicFormField,
  isDynamicFormGroup,
  isDynamicFormRow,
} from './model';
import { createFormGroup } from './create-form-group';
import { DynamicFormFieldComponent } from './dynamic-form-field';
import { DynamicFormGroupComponent } from './dynamic-form-group';

@Component({
  selector: 'fest-dynamic-form',
  imports: [
    ReactiveFormsModule,
    DynamicFormFieldComponent,
    DynamicFormGroupComponent,
  ],
  template: `@let frm = form();
    <form [formGroup]="formGroup()">
      @for (item of frm.children; track $index) {
        @if (isGroup(item)) {
          <fest-dynamic-form-group [group]="item" />
        } @else if (isField(item)) {
          <fest-dynamic-form-field [field]="item" />
        } @else if (isRow(item)) {
          TODO: ROW
        } @else {
          {{ assertNever(item) }}
        }
      }
      <ng-content />
    </form>`,
})
export class DynamicFormComponent {
  readonly form = input.required<DynamicFormGroup>();

  protected readonly formGroup = computed(() => createFormGroup(this.form()));

  protected isField(item: DynamicFormItem): item is DynamicFormField {
    return isDynamicFormField(item);
  }

  protected isGroup(item: DynamicFormItem): item is DynamicFormGroup {
    return isDynamicFormGroup(item);
  }

  protected isRow(item: DynamicFormItem): item is DynamicFormRow {
    return isDynamicFormRow(item);
  }

  protected assertNever(item: never) {
    console.error(`item should be never, but is ${item}`);
  }

  readonly #formGroup$ = toObservable(this.formGroup);

  readonly formEvents = outputFromObservable(
    this.#formGroup$.pipe(switchMap((formGroup) => formGroup.events)),
  );
}
