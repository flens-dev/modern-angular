import { Component, inject, input } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { DynamicFormField } from './model';

@Component({
  selector: 'fest-dynamic-form-field',
  imports: [ReactiveFormsModule],
  template: `@let fld = field();
    <div [formGroup]="parentFormGroup">
      <label>{{ fld.label }}</label>
      <input [formControlName]="fld.key" />
    </div>`,
})
export class DynamicFormFieldComponent {
  protected readonly parentControl = inject(ControlContainer, {
    skipSelf: true,
  });
  protected readonly parentFormGroup = this.parentControl.control as FormGroup;

  readonly field = input.required<DynamicFormField>();
}
