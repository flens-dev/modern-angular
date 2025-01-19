import { Component, computed, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DynamicFormGroup, isDynamicFormControl } from './model';
import {
  DynamicFormControlComponent,
  DynamicFormControlComponentInput,
} from './dynamic-form-control';

export type DynamicFormGroupComponentInput = Readonly<{
  dynamicControl: DynamicFormGroup;
  reactiveControl: FormGroup;
}>;

@Component({
  selector: 'fest-dynamic-form-group',
  imports: [ReactiveFormsModule, DynamicFormControlComponent],
  template: `<div [formGroup]="reactiveFormGroup()">
    @for (control of controls(); track control.dynamicControl.key) {
      @if (isGroup(control)) {
        <fest-dynamic-form-group [group]="control" />
      } @else {
        <fest-dynamic-form-control [control]="control" />
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
  protected readonly controls = computed(
    (): (
      | DynamicFormGroupComponentInput
      | DynamicFormControlComponentInput
    )[] => {
      const group = this.group();

      return group.dynamicControl.children
        .filter(isDynamicFormControl)
        .map((dynamicControl) => {
          const reactiveControl = group.reactiveControl.get(dynamicControl.key);

          let control:
            | DynamicFormGroupComponentInput
            | DynamicFormControlComponentInput
            | null = null;

          if (reactiveControl != null) {
            if (
              dynamicControl.type === 'GROUP' &&
              reactiveControl instanceof FormGroup
            ) {
              control = {
                dynamicControl,
                reactiveControl,
              };
            } else if (
              dynamicControl.type !== 'GROUP' &&
              reactiveControl instanceof FormControl
            ) {
              control = {
                dynamicControl,
                reactiveControl,
              };
            }
          }

          return control;
        })
        .filter((control) => control != null);
    },
  );

  protected isGroup(
    control: DynamicFormControlComponentInput | DynamicFormGroupComponentInput,
  ): control is DynamicFormGroupComponentInput {
    return control.dynamicControl.type === 'GROUP';
  }
}
