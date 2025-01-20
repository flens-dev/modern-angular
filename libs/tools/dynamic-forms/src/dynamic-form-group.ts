import { Component, computed, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
  DynamicFormGroup,
  isDynamicFormControl,
  isDynamicFormField,
  isDynamicFormGroup,
} from './model';
import { DynamicFormItemComponent } from './dynamic-form-item';
import { DynamicFormFieldComponentInput } from './dynamic-form-field';

export type DynamicFormGroupComponentInput = Readonly<{
  dynamicControl: DynamicFormGroup;
  reactiveControl: FormGroup;
}>;

@Component({
  selector: 'fest-dynamic-form-group',
  imports: [ReactiveFormsModule, DynamicFormItemComponent],
  template: `<div [formGroup]="reactiveFormGroup()">
    @for (item of items(); track item.dynamicControl.key) {
      <fest-dynamic-form-item [item]="item" />
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
      .filter(isDynamicFormControl)
      .map((dynamicControl) => {
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
      .filter((control) => control != null);
  });
}
