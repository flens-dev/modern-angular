import { Component, computed, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
  DynamicFormGroup,
  DynamicFormRow,
  isDynamicFormField,
  isDynamicFormGroup,
  isDynamicFormRow,
} from './model';
import {
  DynamicFormFieldComponent,
  DynamicFormFieldComponentInput,
} from './dynamic-form-field';

export type DynamicFormGroupComponentInput = Readonly<{
  dynamicControl: DynamicFormGroup;
  reactiveControl: FormGroup;
}>;

type RowInput = Readonly<{
  dynamicControl: DynamicFormRow;
}>;

type ItemInput =
  | DynamicFormFieldComponentInput
  | DynamicFormGroupComponentInput
  | RowInput;

@Component({
  selector: 'fest-dynamic-form-group',
  imports: [ReactiveFormsModule, DynamicFormFieldComponent],
  template: `<div [formGroup]="reactiveFormGroup()">
    @for (item of items(); track $index) {
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
  </div>`,
})
export class DynamicFormGroupComponent {
  readonly group = input.required<DynamicFormGroupComponentInput>();

  protected readonly reactiveFormGroup = computed(
    () => this.group().reactiveControl,
  );

  protected readonly dynamicFormGroup = computed(
    () => this.group().dynamicControl,
  );
  protected readonly items = computed(() => {
    const group = this.group();

    return group.dynamicControl.children
      .map((dynamicControl) => {
        if (isDynamicFormRow(dynamicControl)) {
          return {
            dynamicControl,
          } satisfies RowInput;
        }

        const reactiveControl = group.reactiveControl.get(dynamicControl.key);

        if (reactiveControl != null) {
          if (
            isDynamicFormGroup(dynamicControl) &&
            reactiveControl instanceof FormGroup
          ) {
            return {
              dynamicControl,
              reactiveControl,
            } satisfies DynamicFormGroupComponentInput;
          }

          if (
            isDynamicFormField(dynamicControl) &&
            reactiveControl instanceof FormControl
          ) {
            return {
              dynamicControl,
              reactiveControl,
            } satisfies DynamicFormFieldComponentInput;
          }
        }

        return null;
      })
      .filter((item) => item != null);
  });

  protected isField(item: ItemInput): item is DynamicFormFieldComponentInput {
    return isDynamicFormField(item.dynamicControl);
  }

  protected isGroup(item: ItemInput): item is DynamicFormGroupComponentInput {
    return isDynamicFormGroup(item.dynamicControl);
  }

  protected isRow(item: ItemInput): item is RowInput {
    return isDynamicFormRow(item.dynamicControl);
  }

  protected assertNever(item: never) {
    console.error(`item should be never, but is ${item}`);
  }
}
