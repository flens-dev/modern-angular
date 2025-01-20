import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { DynamicFormField } from './model';

export type DynamicFormFieldComponentInput = Readonly<{
  dynamicControl: DynamicFormField;
  reactiveControl: FormControl;
}>;

@Component({
  selector: 'fest-dynamic-form-field',
  imports: [ReactiveFormsModule],
  template: `<div>
    @let dynCtrl = field().dynamicControl;
    {{ dynCtrl.key }} ({{ dynCtrl.type }}): {{ dynCtrl.label }}
  </div>`,
})
export class DynamicFormFieldComponent {
  readonly field = input.required<DynamicFormFieldComponentInput>();
}
