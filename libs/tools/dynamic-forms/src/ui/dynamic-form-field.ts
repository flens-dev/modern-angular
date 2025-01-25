import { Component, inject, input } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import type { DynamicFormField } from '../domain/model';

@Component({
  selector: 'fest-dynamic-form-field',
  imports: [ReactiveFormsModule],
  template: `@let fld = field();
    <div [formGroup]="parentFormGroup" style="display: flex; direction: row">
      <label style="flex: 0 0 auto">{{ fld.label }}</label>
      <input style="flex: 1 1 auto" [formControlName]="fld.key" />
    </div>`,
})
export class DynamicFormFieldComponent {
  protected readonly parentControl = inject(ControlContainer, {
    skipSelf: true,
  });
  protected readonly parentFormGroup = this.parentControl.control as FormGroup;

  readonly field = input.required<DynamicFormField>();
}
