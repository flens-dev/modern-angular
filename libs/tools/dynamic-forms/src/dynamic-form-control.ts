import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { DynamicFormControl, DynamicFormGroup } from './model';

export type DynamicFormControlComponentInput = Readonly<{
  dynamicControl: Exclude<DynamicFormControl, DynamicFormGroup>;
  reactiveControl: FormControl;
}>;

@Component({
  selector: 'fest-dynamic-form-control',
  imports: [ReactiveFormsModule],
  template: `<div>
    @let dynCtrl = control().dynamicControl;
    {{ dynCtrl.key }} ({{ dynCtrl.type }}): {{ dynCtrl.label }}
  </div>`,
})
export class DynamicFormControlComponent {
  readonly control = input.required<DynamicFormControlComponentInput>();
}
